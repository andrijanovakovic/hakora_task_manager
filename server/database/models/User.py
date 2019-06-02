"""
    USERS MODEL
"""

from www import app
import mongoengine
import datetime


class User(mongoengine.Document):
    username = mongoengine.StringField(required=True)
    password = mongoengine.StringField(required=True)
    email = mongoengine.StringField(required=True)

    active_hash = mongoengine.StringField(required=False, default=None)
    active_hash_expires = mongoengine.DateTimeField(required=False,
                                                    default=None)

    recover_hash = mongoengine.StringField(required=False)
    recover_hash_expires = mongoengine.DateTimeField(required=False)

    active = mongoengine.BooleanField(required=True, default=False)
    locked = mongoengine.BooleanField(required=True, default=True)  # locked changes depending on user active or not

    first_name = mongoengine.StringField(required=False)
    last_name = mongoengine.StringField(required=False)
    show_as = mongoengine.StringField(required=False)
    date_of_birth = mongoengine.DateTimeField(required=False)

    created_at = mongoengine.DateTimeField(required=True, default=datetime.datetime.now)
    updated_at = mongoengine.DateTimeField(required=False, default=datetime.datetime.now)

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'users',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()


mongoengine.signals.pre_save.connect(User.pre_save, sender=User)
