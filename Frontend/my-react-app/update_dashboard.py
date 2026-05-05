import re

html_file = 'src/components/dashboard_new.html'
jsx_file = 'src/components/Dashboard.jsx'

with open(html_file, 'r') as f:
    html = f.read()

# Extract body contents
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
if not body_match:
    print("Could not find body in HTML")
    exit(1)
body_content = body_match.group(1)

# Convert class to className
jsx_content = body_content.replace('class=', 'className=')
# Convert for to htmlFor
jsx_content = jsx_content.replace('for=', 'htmlFor=')
# Self-close img, input
jsx_content = re.sub(r'(<(img|input)[^>]*)(?<!/)>', r'\1 />', jsx_content)
# Convert inline styles (simplistic)
jsx_content = jsx_content.replace("style=\"width: 45%\"", "style={{width: '45%'}}")
jsx_content = jsx_content.replace("style=\"font-variation-settings: 'FILL' 1;\"", "style={{fontVariationSettings: \"'FILL' 1\"}}")

# Now inject logic where appropriate:
# We need to replace the static "Alex" with {userName}
jsx_content = jsx_content.replace("Alex", "{userName}")

# Current Balance: $24,562.00 -> ₹{balance.toLocaleString()}
jsx_content = re.sub(r'\$24,\s*562\.00', r'₹{balance.toLocaleString()}', jsx_content)

# Total Budget: $8,500.00 -> ₹{income.toLocaleString()}
jsx_content = re.sub(r'\$8,\s*500\.00', r'₹{income.toLocaleString()}', jsx_content)

# Total Expense: $3,842.50 -> ₹{expense.toLocaleString()}
jsx_content = re.sub(r'\$3,\s*842\.50', r'₹{expense.toLocaleString()}', jsx_content)

# Current Score: 750 -> {creditScore || "-"}
jsx_content = re.sub(r'<span className="text-3xl font-bold text-text-primary normal-case">750</span>', r'<span className="text-3xl font-bold text-text-primary normal-case">{creditScore || "-"}</span>', jsx_content)

# Area Chart Placeholder -> AreaChart component
area_chart = """
<div className="flex-1 w-full bg-surface-container-lowest rounded-lg border border-border flex items-center justify-center text-text-secondary font-metadata" style={{minHeight: '220px'}}>
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={expenseTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
      <XAxis dataKey="day" stroke="#606060" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#606060" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
      <Tooltip />
      <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
      <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
    </AreaChart>
  </ResponsiveContainer>
</div>
"""
jsx_content = jsx_content.replace("[Area Chart: Income (Green) vs Expense (Red)]", area_chart)

# Donut Chart Placeholder -> PieChart component
pie_chart = """
<div className="flex-1 w-full flex items-center justify-center flex-col gap-4" style={{minHeight: '220px'}}>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]}
        cx="50%" cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      >
        {(categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={categoryData.length > 0 ? COLORS[index % COLORS.length] : '#334155'} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} iconType="circle" />
    </PieChart>
  </ResponsiveContainer>
</div>
"""
jsx_content = re.sub(r'<div className="w-32 h-32 rounded-full border-\[12px\][^<]*</div>\s*<ul[^>]*>.*?</ul>', pie_chart, jsx_content, flags=re.DOTALL)

# Recent Transactions static rows -> map
transactions_tbody = """
<tbody>
  {recentTransactions.map(t => (
    <tr key={t._id} className="border-b border-surface-container-highest hover:bg-surface-container-lowest transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">{t.type === 'income' ? 'account_balance_wallet' : 'shopping_cart'}</span>
          </div>
          <span className="font-body text-body text-text-primary">{t.name || t.category || 'Uncategorized'}</span>
        </div>
      </td>
      <td className="py-3 px-4 font-body-small text-body-small text-text-secondary">{t.category}</td>
      <td className="py-3 px-4 font-body-small text-body-small text-text-secondary">{new Date(t.date).toLocaleDateString()}</td>
      <td className={`py-3 px-4 font-body text-body font-medium text-right ${t.type === 'income' ? 'text-success' : 'text-text-primary'}`}>
        {t.type === 'income' ? '+' : '-'}₹{t.amount}
      </td>
    </tr>
  ))}
</tbody>
"""
jsx_content = re.sub(r'<tbody>.*?</tbody>', transactions_tbody, jsx_content, flags=re.DOTALL)

# Add activeView conditional rendering to Main Content
main_content_start = '<main className="flex-1 ml-0 md:ml-60 mr-0 lg:mr-80 overflow-y-auto bg-background p-6">'
main_content_inner = jsx_content.split(main_content_start)[1].split('</main>')[0]

# we wrap it with {activeView === 'overview' && (<> ... </>)}
new_main_content = f"""<main className="flex-1 ml-0 md:ml-60 mr-0 lg:mr-80 overflow-y-auto bg-background p-6">
  {{activeView === 'overview' && (
    <>
      {main_content_inner}
    </>
  )}}
  {{activeView === "transactions" && <Transactions />}}
  {{activeView === "budget" && <MonthlySetup />}}
  {{activeView === "loan" && <LoanOffers />}}
</main>"""

jsx_content = jsx_content.replace(main_content_start + main_content_inner + '</main>', new_main_content)

# Add onClick to SideNavBar links
jsx_content = jsx_content.replace('href="#"', 'href="#" onClick={(e) => e.preventDefault()}')

# Replace the full return block in Dashboard.jsx
with open(jsx_file, 'r') as f:
    dashboard_code = f.read()

# find return ( ... ); at the end
start_idx = dashboard_code.find('return (')
end_idx = dashboard_code.rfind(');') + 2

if start_idx == -1:
    print("Could not find return statement")
    exit(1)

# Ensure AIChat and Toast are included
new_return = f"""return (
    <div className="bg-background text-on-background antialiased h-screen overflow-hidden flex flex-col font-body">
      {jsx_content}
      <AIChat />
      {{activeToast && (
        <div className="fixed bottom-8 right-8 z-50 min-w-[320px] bg-inverse-surface text-white p-4 rounded-xl shadow-lg flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Zap color="white" size={20} />
          </div>
          <div className="flex-1">
            <h5 className="font-bold text-sm m-0">{{activeToast.title}}</h5>
            <p className="text-xs text-neutral-300 m-0 mt-1">{{activeToast.message}}</p>
          </div>
          <button onClick={{() => setActiveToast(null)}} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}}
    </div>
  );"""

new_dashboard_code = dashboard_code[:start_idx] + new_return + dashboard_code[end_idx:]

with open(jsx_file, 'w') as f:
    f.write(new_dashboard_code)

print("Updated Dashboard.jsx")
