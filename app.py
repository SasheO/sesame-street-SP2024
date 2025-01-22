from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/save-user', methods=['POST'])
def save_user():
    data = request.json
    uid = data.get('uid')
    user_data = data.get('userData')
    save_user_data(uid, user_data)
    return jsonify({"message": "User data saved!"}), 200
