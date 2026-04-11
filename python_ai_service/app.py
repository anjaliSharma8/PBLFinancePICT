import os
import certifi
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import google.generativeai as genai
import datetime
from bson.objectid import ObjectId

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Fix for SSL connecting to MongoDB Atlas
# If URI is missing, it will crash here, so ensure .env is correctly loaded
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where()) if MONGO_URI else None
db = client.test if client else None

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    if db is None:
        return jsonify({"alerts": [{"type": "warning", "message": "Database not connected."}]})
        
    user_id = request.args.get('userId')
    if not user_id or len(user_id) != 24:
        return jsonify({"alerts": [{"type": "warning", "message": "User not authenticated."}]})
        
    tx_cursor = db.transactions.find({"type": "expense", "userId": ObjectId(user_id)})
    transactions = list(tx_cursor)
    
    if not transactions:
        return jsonify({"alerts": [{"type": "info", "message": "Start logging transactions to receive AI insights!"}]})

    df = pd.DataFrame(transactions)
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    
    total_spent = df['amount'].sum()
    top_category = df.groupby('category')['amount'].sum().idxmax()
    top_amount = df.groupby('category')['amount'].sum().max()
    
    alerts = []
    
    if top_amount > 0:
        alerts.append({
            "type": "warning", 
            "message": f"You are spending heavily on {top_category} (₹{top_amount}). Consider cutting back."
        })
        
    budget_cursor = db.budgets.find({"userId": ObjectId(user_id)})
    budgets = list(budget_cursor)
    
    if budgets:
        latest_budget = budgets[-1]
        income = float(latest_budget.get('income', 0))
        alerts.append({
            "type": "success",
            "message": f"Total expenses: ₹{total_spent}. Current Balance: ₹{income - total_spent}."
        })
        if income > 0 and total_spent > (income * 0.8):
            alerts.insert(0, {
                "type": "danger",
                "message": f"CRITICAL: You have spent {(total_spent/income)*100:.1f}% of your planned budget limit!"
            })
    else:
        alerts.append({
            "type": "success",
            "message": f"Total recorded expenses are ₹{total_spent}. Set up a budget to see your balance!"
        })
            
    return jsonify({"alerts": alerts})

@app.route('/api/chat', methods=['POST'])
def chat():
    if db is None:
        return jsonify({"reply": "Database connection missing."})
        
    if request.is_json:
        data = request.json
        user_message = data.get('message', '')
        user_id = data.get('userId', '')
        file = None
    else:
        user_message = request.form.get('message', '')
        user_id = request.form.get('userId', '')
        file = request.files.get('file')
    
    if not user_id or len(user_id) != 24:
        return jsonify({"reply": "User not authenticated. Please log in to use AI Chat."})
    
    tx_cursor = db.transactions.find({"type": "expense", "userId": ObjectId(user_id)}).sort("date", -1).limit(20)
    tx_data = [{"category": t.get("category"), "amount": t.get("amount"), "date": t.get("date")} for t in tx_cursor]
    
    budget_cursor = db.budgets.find({"userId": ObjectId(user_id)}).sort("createdAt", -1).limit(1)
    budgets = list(budget_cursor)
    budget_context = ""
    if budgets:
        income = budgets[0].get('income', 0)
        budget_context = f"User has a monthly planned budget of ₹{income}."

    csv_context = ""
    if file and file.filename.endswith('.csv'):
        try:
            df_curr = pd.read_csv(file)
            df_curr.columns = [str(c).lower().strip() for c in df_curr.columns]
            
            amount_col = next((c for c in df_curr.columns if 'amount' in c or 'debit' in c or '₹' in c or 'spend' in c or 'withdrawal' in c), None)
            desc_col = next((c for c in df_curr.columns if 'description' in c or 'detail' in c or 'remark' in c or 'category' in c or 'narrative' in c or 'particulars' in c), None)
            date_col = next((c for c in df_curr.columns if 'date' in c or 'time' in c), None)
            
            if amount_col:
                # Remove non-numeric characters except . and - and convert to float
                df_curr['parsed_amount'] = pd.to_numeric(df_curr[amount_col].astype(str).str.replace(r'[^\d.-]', '', regex=True), errors='coerce').fillna(0)
                # Keep positive values if there's no way to distinguish debit/credit or just sum all amounts
                total_spent = df_curr['parsed_amount'].abs().sum() if df_curr['parsed_amount'].min() < 0 else df_curr['parsed_amount'].sum()
                csv_context += f"\nUploaded CSV Analysis: The user uploaded a custom transaction log. The total amount recorded in the file is ₹{total_spent:,.2f}. "
                
                if date_col:
                    df_curr[date_col] = pd.to_datetime(df_curr[date_col], errors='coerce')
                    daily_spent = df_curr.groupby(df_curr[date_col].dt.date)['parsed_amount'].apply(lambda x: x.abs().sum())
                    if not daily_spent.empty:
                        max_day = daily_spent.idxmax()
                        max_val = daily_spent.max()
                        if pd.notnull(max_day):
                            csv_context += f"Highest recorded daily spending was ₹{max_val:,.2f} on {max_day}. "
                
                if desc_col:
                    top_descriptions = df_curr.groupby(desc_col)['parsed_amount'].apply(lambda x: x.abs().sum()).sort_values(ascending=False).head(3)
                    top_desc_str = ", ".join([f"'{k}' (₹{v:,.2f})" for k, v in top_descriptions.items()])
                    csv_context += f"The top spending items/categories in this file are: {top_desc_str}. "
        except Exception as e:
            print(f"Error parsing CSV: {e}")
            csv_context = "\n(The user tried to upload a CSV file but it could not be fully parsed or lacked standard 'amount'/'date' columns)."
    elif file and file.filename.endswith('.pdf'):
        try:
            import pypdf
            reader = pypdf.PdfReader(file)
            pdf_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pdf_text += text + "\n"
            
            if len(pdf_text) > 50000:
                pdf_text = pdf_text[:50000] + "\n...[Text Truncated]..."
                
            csv_context += f"\nUploaded PDF Analysis: The user uploaded a bank statement in PDF format. Raw extracted text:\n{pdf_text}\n(Please analyze the above raw text, which acts as a transaction log, to answer the user's question regarding their spending, trends, and budget suggestions. Ignore visual layout artifacts and extract logical transactions.)."
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            csv_context = "\n(The user tried to upload a PDF file but there was an error extracting text from it)."
        
    system_prompt = f"""
    You are 'VaultCore AI', an expert financial assistant integrated into a high-end personal finance app.
    The user is asking a proactive question about their finances (e.g., 'Should I buy this?').
    Context:
    {budget_context}
    Recent user database expenses: {tx_data}
    {csv_context}
    Constraint: Provide a concise (max 3-4 sentences), highly analytical, and friendly answer. 
    Use the database expenses AND any Uploaded CSV Analysis (if present) to justify if they can afford an item or to provide suggestions on managing their money.
    """
    
    if GEMINI_API_KEY:
        try:
            import urllib.request
            import urllib.error
            import json
            
            clean_key = GEMINI_API_KEY.strip()
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={clean_key}"
            prompt = f"{system_prompt}\n\nUser Question:\n{user_message}"
            data = json.dumps({
                "contents": [{"parts": [{"text": prompt}]}]
            }).encode('utf-8')
            
            req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                
            reply = result['candidates'][0]['content']['parts'][0]['text']
            return jsonify({"reply": reply})
        except urllib.error.HTTPError as e:
            print(f"Gemini API Google Error {e.code}: {e.read().decode()}")
            pass # Fallback to local heuristic
        except Exception as e:
            print(f"Gemini API General Error: {e}")
            pass # Fallback to local heuristic
    # ==========================================
    # OFFLINE PANDAS / PYTHON HEURISTIC ENGINE
    # ==========================================
    import re
    msg = user_message.lower()
    
    if "budget" in msg:
        if budgets:
            inc = budgets[0].get('income', 0)
            exps = budgets[0].get('totalExpense', 0)
            reply = f"(Offline AI) Your latest expected income is ₹{inc}, with planned expenses of ₹{exps}. You have a theoretical buffer of ₹{inc - exps}."
        else:
            reply = "(Offline AI) I don't see any active budgets set up yet. Go to Budget Setup to create one!"
            
    elif "afford" in msg or "buy" in msg or "purchase" in msg:
        amounts = re.findall(r'\d+', msg)
        if amounts:
            amount = int(amounts[-1])
            if budgets:
                inc = budgets[0].get('income', 0)
                tx_curr = sum([int(t.get('amount', 0)) for t in tx_data])
                remaining = inc - tx_curr
                if amount <= remaining:
                    reply = f"(Offline AI) You have ₹{remaining} left this month. Buying this item for ₹{amount} is within your limits! Go ahead, but watch your savings."
                else:
                    reply = f"(Offline AI) Warning! You only have ₹{remaining} left before exceeding your income. A ₹{amount} purchase will break your budget!"
            else:
                reply = "(Offline AI) I need you to set up a budget first before I can calculate if you can afford that!"
        else:
            reply = "(Offline AI) Please include the exact price (e.g. '50000') so I can run the numbers against your active Pandas dataframe!"
    else:
        reply = "I'm VaultCore AI (Running in Offline Python Mode because your Gemini API key is missing). Ask me 'Can I afford a PS5 for 50000?' or 'What is my budget?' to see me crunch numbers locally!"

    return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
