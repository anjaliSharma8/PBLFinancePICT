import re

log_path = "/Users/vedantborude/.gemini/antigravity/brain/e27e833c-c9fe-46ec-af01-3cca1e72b0aa/.system_generated/logs/overview.txt"

with open(log_path, 'r') as f:
    logs = f.read()

# Find the view_file response for Dashboard.jsx
match = re.search(r'File Path: `file:///Users/vedantborude/Desktop/PROJECTS/PBLFinancePICT/Frontend/my-react-app/src/components/Dashboard.jsx`.*?Showing lines 1 to 787.*?<original_line>\. Please note that any changes targeting the original code should remove the line number, colon, and leading space\.\n(.*?)The above content shows the entire, complete file contents of the requested file\.', logs, re.DOTALL)

if match:
    content_with_lines = match.group(1)
    
    # Strip line numbers: "1: import React..." -> "import React..."
    # The format is \d+: <original_line>\n
    lines = content_with_lines.split('\n')
    cleaned_lines = []
    for line in lines:
        if line == '':
            continue
        cleaned = re.sub(r'^\d+:\s?', '', line)
        cleaned_lines.append(cleaned)
        
    with open('src/components/Dashboard.jsx', 'w') as out:
        out.write('\n'.join(cleaned_lines))
    print("Successfully restored Dashboard.jsx from logs")
else:
    print("Could not find the content in logs")
