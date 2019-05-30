"""
    authentication routes
"""

from www import app
import json
from flask import request, jsonify
from utilities.validators import email_valid, password_length_correct, username_length_correct
from database.controllers.User import create_new_user, get_user_by_username_or_email, delete_user
from utilities.mailer import send_email_without_template


@app.route('/api/auth/register', methods=["POST"])
def register_user():
    request_body = json.loads(request.data)

    username = request_body["username"]
    password = request_body["password"]
    email = request_body["email"]

    # check if username, password and email are filled
    if username == "" or password == "" or email == "":
        return jsonify({"success": False, "message": "All the fields need to be filled!"}), 500

    if not username_length_correct(username):
        return jsonify({"success": False, "message": "Username length needs to be 10 or greater!"}), 500

    if not password_length_correct(password):
        return jsonify({"success": False, "message": "Password length needs to be 10 or greater!"}), 500

    if not email_valid(email):
        return jsonify({"success": False, "message": "Email you have entered is not valid!"}), 500

    user = get_user_by_username_or_email(username, email)
    if user:
        return jsonify({"success": False, "reason": "User with those credentials already exists!"}), 500

    new_user = create_new_user({"username": username, "password": password, "email": email})

    activation_link = app.config["CLIENT_FULL_URL"] + "/activate_user/" + str(new_user.active_hash)

    send_mail_status = send_email_without_template(
        "HAKORA - Registration successful!",
        "Your registration was sucessfull but there is one more step left before you can use Hakora Task Manager.\n"
        "You need to activate your account. You can do that by clicking the link below:\n\n" +
        activation_link +
        "\n\nThe activation link will be valid until: " +
        str(new_user.active_hash_expires),
        [new_user.email]
    )

    if send_mail_status["success"]:
        return jsonify({"success": True, "message": "Your account was successfully registered." +
                                                    "Please check your email for activation link."}), 200
    delete_user(new_user.id)
    return jsonify({"success": False, "message": "Error occured while sending an email to you, "
                                                 "please try to register a bit later."}), 200


@app.route('/api/auth/login', methods=["POST"])
def login_user():
    request_body = json.loads(request.data)

    identifier = request_body["username"]
    password = request_body["password"]

    if identifier == "" or password == "":
        return jsonify({"success": False, "reason": "All the fields need to be filled!"}), 500
