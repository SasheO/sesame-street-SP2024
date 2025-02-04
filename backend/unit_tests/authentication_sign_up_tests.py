import requests
import time

# data = {"email":input("email: "), "password":input("password: ")}
test_examples = {
    "good patient": {"email":"tester.person@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "tester", "surname": "person", "preferred_lang": "English"}, # good patient
    "empty email":{"email":"", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User1", "preferred_lang": "English"}, # empty email
    "no email": {"password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User3", "preferred_lang": "English"}, # no email
    "empty password":{"email":"testuseremail1.com", "password":"", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User2", "preferred_lang": "English"}, # empty password
    " empty user_type":{"email":"testuseremail2@gmail.com", "password":"12.3raefo9,q24eS", "user_type":"", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User632", "preferred_lang": "English"}, # empty user_type
    "no password":{"email":"testuseremail3.com", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User3", "preferred_lang": "English"}, # no password
    "no user_type":{"email":"testuseremail4@gmail.com", "password":"awf94m.3awefdSeS", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User", "preferred_lang": "English"}, # no user_type
    "invalid user_type":{"email":"testuseremail5@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"invalid", "dob":"11-23-2002", "gender":"F", "first_name": "Test2", "surname": "User3", "preferred_lang": "English"}, # invalid user_type
    "invalid dob format":{"email":"testuseremail6@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"patient", "dob":"22-2-2002", "gender":"F", "first_name": "Test3425", "surname": "User", "preferred_lang": "English"}, # invalid dob format
    "empty dob":{"email":"testuseremail7@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"patient", "dob":"", "gender":"F", "first_name": "Test", "surname": "User", "preferred_lang": "English"}, # empty dob
    "no dob":{"email":"testuseremail8@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"patient", "gender":"F", "first_name": "Test4", "surname": "User", "preferred_lang": "English"}, # no dob
    "good patient 2":{"email":"testuseremail9@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "User", "preferred_lang": "Yoruba"}, # good patient 2
    "good patient 3":{"email":"thomassanka@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Thomas", "surname": "Sanka", "preferred_lang": "Yoruba"}, # good patient 3
    "no dob":{"email":"testuseremail11@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "gender":"M", "first_name": "Test3", "surname": "User3", "preferred_lang": "Yoruba"}, # no dob
    "good patient no gender":{"email":"testuseremail12@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "first_name": "Test", "surname": "User", "preferred_lang": "Yoruba"}, # good patient no gender
    "good patient empty first name":{"email":"testuseremail13@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "", "surname": "User", "preferred_lang": "Yoruba"}, # good patient empty first name
    "good patient empty surname":{"email":"testuseremail14@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "", "preferred_lang": "Yoruba"}, # good patient empty surname
    "no first name":{"email":"testuseremail15@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "surname": "User", "preferred_lang": "Yoruba"}, # no first name
    "no surname":{"email":"testuseremail16@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test",  "preferred_lang": "Yoruba"}, # no surname
    "good patient empty language":{"email":"testuseremail17@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "User", "preferred_lang": ""}, # good patient empty language
    "good patient no language":{"email":"testuseremail17@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "User"}, # good patient no language
    "arleady used email":{"email":"tester.person@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "tester", "surname": "person", "preferred_lang": "English"}, # arleady used email
    "already used email (no dob, patient)":{"email":"testuseremail13@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "", "surname": "User", "preferred_lang": "Yoruba"}, # already used email (no dob, patient)
    # TODO: add and test practicioner user types    
}

output_file = input("Filename: ")+".txt"
with open(output_file, "a+") as f:
    for label, test in test_examples.items():
        response = requests.post("http://localhost:5000/sign_up", json=test)
        try:
            print(label)
            f.write(label+"\n")
            print(test)
            f.write(str(test)+"\n")
            print(response.json())
            f.write(str(response.json())+"\n")
        except Exception as e:
            print(e)
            f.write(str(e))
            print(response)
            f.write(str(response))
        time.sleep(1)
        f.write("\n\n")
        print()
        print()
