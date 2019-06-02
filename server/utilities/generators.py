import string
import random
from urllib.parse import quote
from hashlib import sha512
import bcrypt
import jwt
import datetime
from www import app


def generate_random_string(string_length=64, allowed_characters=string.ascii_letters):
    return ''.join(random.choice(allowed_characters) for _ in range(string_length)).encode('utf-8')


def generate_active_or_recover_hash_token():
    return quote(sha512(generate_random_string(512)).hexdigest())


def generate_password_hash(password=""):
    encoded_password = password.encode('utf-8')
    encoded_password_hashed = bcrypt.hashpw(encoded_password, bcrypt.gensalt())
    hashed_password_as_string = encoded_password_hashed.decode('utf-8')
    return hashed_password_as_string


def generate_jwt(cu):
    token = jwt.encode({
        "username": cu['username'],
        "email": cu['email'],
        "_id": cu['_id'],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=app.config["JWT_IS_VALID_FOR"])
    }, app.config["JWT_SECRET_KEY"])

    return token
