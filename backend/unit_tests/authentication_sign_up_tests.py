import requests
import time

# data = {"email":input("email: "), "password":input("password: ")}
test_examples = {
    "good patient- patient": {"email":"tester.person@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "tester", "surname": "person", "preferred_lang": "English"}, # good patient
    "empty email- patient": {"email":"", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User1", "preferred_lang": "English"}, # empty email
    "no email- patient": {"password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User3", "preferred_lang": "English"}, # no email
    "empty password- patient": {"email":"testuseremail1.com", "password":"", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User2", "preferred_lang": "English"}, # empty password
    "empty user_type- patient": {"email":"testuseremail2@gmail.com", "password":"12.3raefo9,q24eS", "user_type":"", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User632", "preferred_lang": "English"}, # empty user_type
    "no password- patient": {"email":"testuseremail3.com", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User3", "preferred_lang": "English"}, # no password
    "no user_type": {"email":"testuseremail4@gmail.com", "password":"awf94m.3awefdSeS", "dob":"11-23-2002", "gender":"F", "first_name": "Test", "surname": "User", "preferred_lang": "English"}, # no user_type
    "invalid user_type": {"email":"testuseremail5@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"invalid", "dob":"11-23-2002", "gender":"F", "first_name": "Test2", "surname": "User3", "preferred_lang": "English"}, # invalid user_type
    "invalid dob format- patient": {"email":"testuseremail6@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"patient", "dob":"22-2-2002", "gender":"F", "first_name": "Test3425", "surname": "User", "preferred_lang": "English"}, # invalid dob format
    "empty dob- patient": {"email":"testuseremail7@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"patient", "dob":"", "gender":"F", "first_name": "Test", "surname": "User", "preferred_lang": "English"}, # empty dob
    "no dob- patient": {"email":"testuseremail8@gmail.com", "password":"12.3asdqaefo9,q24eS", "user_type":"patient", "gender":"F", "first_name": "Test4", "surname": "User", "preferred_lang": "English"}, # no dob
    "good patient 2- patient": {"email":"testuseremail9@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "User", "preferred_lang": "Yoruba"}, # good patient 2
    "good patient 3- patient": {"email":"thomassanka@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Thomas", "surname": "Sanka", "preferred_lang": "Yoruba"}, # good patient 3
    "no dob- patient": {"email":"testuseremail11@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "gender":"M", "first_name": "Test3", "surname": "User3", "preferred_lang": "Yoruba"}, # no dob
    "good patient no gender- patient": {"email":"testuseremail12@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "first_name": "Test", "surname": "User", "preferred_lang": "Yoruba"}, # good patient no gender
    "good patient empty first name- patient": {"email":"testuseremail13@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "", "surname": "User", "preferred_lang": "Yoruba"}, # good patient empty first name
    "good patient empty surname- patient": {"email":"testuseremail14@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "", "preferred_lang": "Yoruba"}, # good patient empty surname
    "no first name- patient": {"email":"testuseremail15@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "surname": "User", "preferred_lang": "Yoruba"}, # no first name
    "no surname- patient": {"email":"testuseremail16@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test",  "preferred_lang": "Yoruba"}, # no surname
    "good patient empty language- patient": {"email":"testuseremail17@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "User", "preferred_lang": ""}, # good patient empty language
    "good patient no language- patient": {"email":"testuseremail17@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "Test", "surname": "User"}, # good patient no language
    "already used email- patient": {"email":"tester.person@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"F", "first_name": "tester", "surname": "person", "preferred_lang": "English"}, # arleady used email
    "already used email (no dob, patient)- patient": {"email":"testuseremail13@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"patient", "dob":"11-23-2002", "gender":"M", "first_name": "", "surname": "User", "preferred_lang": "Yoruba"}, # already used email (no dob, patient)
    "already used email (email used for patient, this is practitioner)- practitioner":{"email":"tester.person@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "good practitioner":{"email":"practitioner.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "already used email (email used for practitioner, this is patient)":{"email":"practitioner.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "good practitioner 2":{"email":"practitioner2.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"M", "first_name": "Tester2", "surname": "Person2", "specialty": "oncology", "certification":"NOS"}, # already used email (email used for patient, this is practitioner)
    "already used email- practitioner":{"email":"practitioner2.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"M", "first_name": "Tester2", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "empty gender- practitioner":{"email":"practitioner3.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"", "first_name": "Tester2", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "no gender- practitionerr":{"email":"practitioner4.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "first_name": "Tester2", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "empty first name- practitioner":{"email":"practitioner5.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"M", "first_name": "", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "no first name- practitioner":{"email":"practitioner6.tester@gmail.com", "password":"12.3rdaskufq24eS", "user_type":"practitioner", "gender":"M", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "empty password- practitioner":{"email":"practitioner7.tester@gmail.com", "password":"", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "no password- practitioner":{"email":"practitioner8.tester@gmail.com", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "no email- practitioner":{"password":"123cwra'aerwfiu", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "empty email- practitioner":{"email":"", "password":"123cwra'aerwfiu", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "specialty": "cardiology", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "empty specialty- practitioner":{"email":"practitioner9.tester@gmail.com", "password":"123cwra'aerwfiu", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "specialty": "", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "no specialty- practitioner":{"email":"practitioner9.tester@gmail.com", "password":"123cwra'aerwfiu", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "certification":"NCS"}, # already used email (email used for patient, this is practitioner)
    "empty certification- practitioner":{"email":"practitioner9.tester@gmail.com", "password":"123cwra'aerwfiu", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "specialty": "oncology", "certification":""}, # already used email (email used for patient, this is practitioner)
    "no certification- practitioner":{"email":"practitioner10.tester@gmail.com", "password":"123cwra'aerwfiu", "user_type":"practitioner", "gender":"M", "first_name": "Tester", "surname": "Person2", "specialty": "oncology"}, # already used email (email used for patient, this is practitioner)
    
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
