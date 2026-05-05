import re

jsx_file = 'src/components/Dashboard.jsx'
with open(jsx_file, 'r') as f:
    content = f.read()

# Fix HTML comments
content = re.sub(r'<\s*!--(.*?)-->', r'{/* \1 */}', content)

# Fix viewBox
content = content.replace('viewbox=', 'viewBox=')

# Fix stroke-width
content = content.replace('stroke-width=', 'strokeWidth=')

# Fix stroke-dasharray
content = content.replace('stroke-dasharray=', 'strokeDasharray=')

# Fix size=20 to size={20}
content = content.replace('size=20', 'size={20}')

with open(jsx_file, 'w') as f:
    f.write(content)

print("Fixed JSX syntax")
