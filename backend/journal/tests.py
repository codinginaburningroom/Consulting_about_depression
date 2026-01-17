import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('AIFORTHAI_API_KEY')
print(f"API_KEY: {API_KEY}\n")

if not API_KEY:
    print("❌ ไม่พบ API Key ใน .env!")
    exit(1)

# ข้อความทดสอบ
test_text = 'วันนี้มีความสุขมาก'

# ===== ทดสอบ 1: POST with JSON =====
print("=" * 60)
print("ทดสอบที่ 1: POST with JSON body")
print("=" * 60)
try:
    url = "https://api.aiforthai.in.th/ssense"
    response = requests.post(
        url,
        headers={
            'Apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        json={'text': test_text},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print(f"Headers: {dict(response.headers)}")
except Exception as e:
    print(f"Error: {e}")

print()

# ===== ทดสอบ 2: POST with form data =====
print("=" * 60)
print("ทดสอบที่ 2: POST with form data")
print("=" * 60)
try:
    url = "https://api.aiforthai.in.th/ssense"
    response = requests.post(
        url,
        headers={
            'Apikey': API_KEY
        },
        data={'text': test_text},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

print()

# ===== ทดสอบ 3: GET with query params =====
print("=" * 60)
print("ทดสอบที่ 3: GET with query params")
print("=" * 60)
try:
    url = "https://api.aiforthai.in.th/ssense"
    response = requests.get(
        url,
        headers={
            'Apikey': API_KEY
        },
        params={'text': test_text},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

print()

# ===== ทดสอบ 4: ตรวจสอบ API endpoint อื่นๆ =====
print("=" * 60)
print("ทดสอบที่ 4: ลอง endpoint ที่อาจจะถูก")
print("=" * 60)

endpoints = [
    "https://api.aiforthai.in.th/ssense",
    "https://api.aiforthai.in.th/sentiment", 
    "https://api.aiforthai.in.th/vtext/ssense",
    "https://api.aiforthai.in.th/textanalytics"
]

for endpoint in endpoints:
    try:
        print(f"\nTrying: {endpoint}")
        response = requests.post(
            endpoint,
            headers={
                'Apikey': API_KEY,
                'Content-Type': 'application/json'
            },
            json={'text': test_text},
            timeout=10
        )
        print(f"  Status: {response.status_code}")
        if response.text:
            print(f"  Response: {response.text[:200]}")
        else:
            print(f"  Response: (empty)")
    except Exception as e:
        print(f"  Error: {e}")

print("\n" + "=" * 60)
print("สรุป")
print("=" * 60)
print("ถ้าทุก endpoint ได้ response ว่าง อาจต้อง:")
print("1. ตรวจสอบ API documentation ของ AIForThai")
print("2. ลองติดต่อ support ของ AIForThai")
print("3. ลองใช้ API อื่นของ AIForThai")
print("4. หรือใช้ model ของตัวเองแทน (pythainlp, transformers)")