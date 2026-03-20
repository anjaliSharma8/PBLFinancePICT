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
        
    data = request.json
    user_message = data.get('message', '')
    user_id = data.get('userId', '')
    
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
        
    system_prompt = f"""
    You are 'VaultCore AI', an expert financial assistant integrated into a high-end personal finance app.
    The user is asking a proactive question about their finances (e.g., 'Should I buy this?').
    Context:
    {budget_context}
    Recent user expenses: {tx_data}
    Constraint: Provide a concise (max 3 sentences), highly analytical, and friendly answer. 
    Use the expenses logic to justify if they can afford the item. 
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
