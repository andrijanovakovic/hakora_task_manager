from functools import wraps
from flask import request, jsonify
from www import app
import jwt
from database.controllers.User import get_user_by_username


def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'authorization' in request.headers:
            token = request.headers.get('authorization')

        if not token or token == "":
            return jsonify({"success": False, "message": "No token provided!"}), 401

        try:
            token = token.split(" ")
            token_decoded = jwt.decode(token[1], app.config['JWT_SECRET_KEY'])
            current_user = get_user_by_username(token_decoded['username'])
        except:
            return jsonify({"success": False, "message": "Token expired!"}), 401

        return f(current_user, *args, **kwargs)

    return decorated
