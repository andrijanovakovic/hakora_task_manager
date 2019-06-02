import re
from www import app
import requests
import bcrypt


def password_length_correct(password=""):
    return len(password) > 10


def username_length_correct(username=""):
    return len(username) > 8


def email_valid(email=""):
    email_match = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"

    if not re.match(email_match, email):
        return False

    mailbox_api_url = "http://apilayer.net/api/check?access_key=" + \
                      app.config["MAILBOX_LAYER_API_KEY"] + \
                      "&email=" + \
                      email + \
                      "&smtp=1&format=1"

    # send get request to apilayer.net
    req = requests.get(url=mailbox_api_url)

    # response from apilayer.net
    req_data = req.json()

    if not req_data['format_valid'] or not req_data['mx_found'] or not req_data["smtp_check"]:
        return False

    # email is valid
    return True


def verify_password(user_input_password, actual_user_password):
    if bcrypt.checkpw(user_input_password.encode('utf-8'), actual_user_password.encode('utf-8')):
        return True
    return False
