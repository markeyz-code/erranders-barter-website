import os
import re

# Fix upload.ts
upload_ts = "/Users/marquis/erranders/barter/website/api_factory/modules/upload.ts"
with open(upload_ts, 'r') as f:
    upload_content = f.read()

upload_content = upload_content.replace(
    "import axios from 'axios'; const ERRANDERS_CORE_WITH_AUTH_FORM_DATA = axios.create({ baseURL: 'https://api.erranders.org', headers: { 'Content-Type': 'multipart/form-data' } }); ERRANDERS_CORE_WITH_AUTH_FORM_DATA.interceptors.request.use((config) => { const token = typeof window !== 'undefined' ? localStorage.getItem('barter_token') || localStorage.getItem('token') : null; if (token) config.headers.Authorization = 'Bearer ' + token; return config; });;",
    "import { GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA } from '../axios.config';"
).replace("ERRANDERS_CORE_WITH_AUTH_FORM_DATA", "GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA")

with open(upload_ts, 'w') as f:
    f.write(upload_content)

# Fix users.ts
users_ts = "/Users/marquis/erranders/barter/website/api_factory/modules/users.ts"
with open(users_ts, 'r') as f:
    users_content = f.read()

users_content = users_content.replace(
    "import axios from 'axios'; const ERRANDERS_CORE_WITH_AUTH = axios.create({ baseURL: 'https://api.erranders.org' }); ERRANDERS_CORE_WITH_AUTH.interceptors.request.use((config) => { const token = typeof window !== 'undefined' ? localStorage.getItem('barter_token') || localStorage.getItem('token') : null; if (token) config.headers.Authorization = 'Bearer ' + token; return config; });",
    "import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';"
).replace("ERRANDERS_CORE_WITH_AUTH", "GATEWAY_ENDPOINT_WITH_AUTH")

with open(users_ts, 'w') as f:
    f.write(users_content)

# Fix business.ts
business_ts = "/Users/marquis/erranders/barter/website/api_factory/modules/business.ts"
with open(business_ts, 'r') as f:
    business_content = f.read()

business_content = business_content.replace(
    "import axios from 'axios'; const ERRANDERS_CORE = axios.create({ baseURL: 'https://api.erranders.org' });",
    "import { GATEWAY_ENDPOINT } from '../axios.config';"
).replace("ERRANDERS_CORE", "GATEWAY_ENDPOINT")

with open(business_ts, 'w') as f:
    f.write(business_content)

# Fix chat.ts
chat_ts = "/Users/marquis/erranders/barter/website/api_factory/modules/chat.ts"
with open(chat_ts, 'r') as f:
    chat_content = f.read()

chat_content = chat_content.replace(
    "import axios from 'axios';",
    "import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';"
).replace(
    "const ERRANDERS_CORE = axios.create({ baseURL: 'https://api.erranders.org' })",
    ""
).replace(
    "const ERRANDERS_CORE_WITH_AUTH = axios.create({ baseURL: 'https://api.erranders.org' })",
    ""
).replace(
    "ERRANDERS_CORE_WITH_AUTH", "GATEWAY_ENDPOINT_WITH_AUTH"
).replace(
    "ERRANDERS_CORE", "GATEWAY_ENDPOINT"
)

with open(chat_ts, 'w') as f:
    f.write(chat_content)

# Fix useRealtimeSocket.ts
socket_ts = "/Users/marquis/erranders/barter/website/composables/core/useRealtimeSocket.ts"
with open(socket_ts, 'r') as f:
    socket_content = f.read()

socket_content = socket_content.replace(
    "let rawUrl = 'https://api.erranders.org'",
    "let rawUrl = config.public.wsBase || 'http://localhost:3100'"
)

with open(socket_ts, 'w') as f:
    f.write(socket_content)


# Now fix alerts in files
directories_to_search = [
    '/Users/marquis/erranders/barter/website/pages',
    '/Users/marquis/erranders/barter/website/components',
    '/Users/marquis/erranders/barter/admin/pages'
]

def replace_alerts_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if "alert(" not in content:
        return
        
    # Add import/composable if needed
    if "useCustomToast" not in content and "<script setup lang=\"ts\">" in content:
        content = content.replace("<script setup lang=\"ts\">", "<script setup lang=\"ts\">\nimport { useCustomToast } from '@/composables/core/useCustomToast';")
    elif "useCustomToast" not in content and "<script setup>" in content:
        content = content.replace("<script setup>", "<script setup>\nimport { useCustomToast } from '@/composables/core/useCustomToast';")
        
    # Custom replacement for alerts
    def alert_replacer(match):
        message = match.group(1)
        toast_type = '"error"'
        
        if "success" in message.lower() or "sent" in message.lower():
            toast_type = '"success"'
        elif "soon" in message.lower():
            toast_type = '"info"'
            
        return f"useCustomToast().showToast({{ title: 'Notice', message: {message}, toastType: {toast_type} }})"
    
    # Replace alert(...)
    content = re.sub(r'alert\((.*?)\)', alert_replacer, content)
    
    with open(filepath, 'w') as f:
        f.write(content)

for directory in directories_to_search:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.vue') or file.endswith('.ts'):
                replace_alerts_in_file(os.path.join(root, file))

print("Fixed endpoints and replaced alerts.")
