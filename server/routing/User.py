"""
    authentication routes
"""

from www import app
from database.models.User import User
import json
from flask import request, jsonify
from utilities.validators import email_valid, password_length_correct, username_length_correct, verify_password
from database.controllers.User import create_new_user, delete_user, get_user_by_email, \
    get_user_by_username, get_user_by_username_or_email, fetch_all_users
from utilities.mailer import send_email_without_template
import datetime
from utilities.generators import generate_jwt
from utilities.generators import generate_active_or_recover_hash_token
from utilities.wrappers import jwt_required


@app.route('/api/auth/register', methods=["POST"])
def register_user():
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    username = reqb["username"]
    password = reqb["password"]
    password_repeat = reqb["password_repeat"]
    email = reqb["email"]
    first_name = reqb["first_name"]
    last_name = reqb["last_name"]
    _date_of_birth = reqb["date_of_birth"]

    # check if username, password and email are filled
    if not username or not password or not password_repeat or not email or not first_name or not last_name or not _date_of_birth:
        return jsonify({"success": False, "message": "All the fields need to be filled!"}), 500

    if not username_length_correct(username):
        return jsonify({"success": False, "message": "Username length needs to be 8 or greater!"}), 500

    if not password_length_correct(password):
        return jsonify({"success": False, "message": "Password length needs to be 10 or greater!"}), 500

    if not email_valid(email):
        return jsonify({"success": False, "message": "Email you have entered is not valid!"}), 500

    if not password == password_repeat:
        return jsonify({"success": False, "message": "Passwords do not match!"})

    user = get_user_by_email(email)
    if user:
        return jsonify(
            {"success": False, "message": "Email address (" + email + ") is already taken, please change."}), 500

    user = get_user_by_username(username)
    if user:
        return jsonify(
            {"success": False, "message": "Username (" + username + ") is already taken, please change."}), 500

    new_user = create_new_user({
        "username": username,
        "password": password,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "date_of_birth": _date_of_birth,
        "active_hash": generate_active_or_recover_hash_token(),
        "active_hash_expires": datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
    })

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
                                                    " Please check your email for activation link."}), 200
    delete_user(new_user.id)
    return jsonify({"success": False, "message": "Error occured while sending an email to you, "
                                                 "please try to register a bit later."}), 200


@app.route('/api/auth/activate', methods=["POST"])
def activate_user():
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    active_hash = reqb['active_hash']

    if not active_hash or active_hash == "":
        return jsonify({"success": False, "message": "Hash not provided!"}), 500

    user = User.objects(active_hash=active_hash).first()
    if not user:
        return jsonify({"success": False, "message": "User with that hash not found."}), 500

    if user.active:
        return jsonify(
            {"success": False, "message": "User already active.", "redirect_page": "Login page",
             "redirect": "/login?msg=already_active"}), 500

    if datetime.datetime.utcnow() > user.active_hash_expires:
        return jsonify({"success": False, "message": "Token for activating your profile has expired, "
                                                     "please reset your password and try activating your profile"
                                                     " again.", "redirect": "/login?msg=token_expired",
                        "redirect_page": "Login page", }), 500

    user.active_hash = None
    user.active_hash_expires = None
    user.active = True
    user.locked = False

    user.save()

    return jsonify({"success": True, "message": "Your profile has been activated, you can login now.",
                    "redirect": "/login?msg=success", "redirect_page": "Login page", })


@app.route('/api/auth/login', methods=["POST"])
def login_user():
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    identifier = reqb["identifier"]
    password = reqb["password"]

    if not identifier or identifier == "":
        return jsonify({"success": False, "message": "No identifier provided!", "data": []}), 500

    if not password or password == "":
        return jsonify({"success": False, "message": "No password provided!", "data": []}), 500

    user = get_user_by_username_or_email(identifier, identifier)
    if not user:
        return jsonify({"success": False, "message": "No user found with those credentials found!", "data": []}), 500

    password_valid = verify_password(password, user.password)
    if not password_valid:
        return jsonify({"success": False, "message": "Username/Email or password invalid!", "data": []}), 401

    # the user
    curr_user = user.to_mongo().to_dict()
    del curr_user['password']
    curr_user['_id'] = str(curr_user['_id'])

    # password is valid
    token = generate_jwt(curr_user)

    return jsonify({"success": True, "token": token.decode('utf-8'), "user": curr_user}), 200


@app.route('/api/auth/check_token_valid', methods=["POST"])
@jwt_required
def check_token_valid(current_user=None):
    return jsonify({"success": True}), 200


@app.route('/api/users/get_all_users', methods=["POST"])
@jwt_required
def get_all_users(current_user=None):
    users = fetch_all_users()
    return jsonify({"success": True, "data": users}), 200
