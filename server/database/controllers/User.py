"""
    ONLY DATABASE OPERATIONS IN THIS FILE,
    EVERYTHING ELSE GOES TO ROUTING OR UTILITIES
"""

from database.models.User import User
from mongoengine.queryset.visitor import Q
from utilities.generators import generate_password_hash
import mongoengine


def get_user_by_username(username: str) -> User:
    user = User.objects(username=username).first()
    return user


def get_user_by_email(email: str) -> User:
    user = User.objects(email=email).first()
    return user


def get_user_by_username_or_email(username: str, email: str) -> User:
    user = User.objects(Q(username=username) | Q(email=email)).first()
    return user


def create_new_user(user_data) -> User:
    user = User()

    user.username = user_data["username"]
    user.password = generate_password_hash(user_data["password"])
    user.email = user_data["email"]
    user.first_name = user_data["first_name"]
    user.last_name = user_data["last_name"]
    user.show_as = user_data["first_name"] + " " + user_data["last_name"]
    user.date_of_birth = user_data["date_of_birth"]
    user.active_hash = user_data["active_hash"]
    user.active_hash_expires = user_data['active_hash_expires']

    user.save()

    return user


def delete_user(user_id):
    user = User.objects(id=user_id).first()
    user.delete()
