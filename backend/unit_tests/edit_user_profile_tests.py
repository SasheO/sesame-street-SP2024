import requests


email = "tester.person@gmail.com"


test_data = {"user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "tester", "surname": "person", "preferred_lang": "English"}

response = requests.post("http://localhost:5000/edit_profile", json=test_data)
print(response)
print(response.json())