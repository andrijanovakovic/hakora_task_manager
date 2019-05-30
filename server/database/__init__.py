import mongoengine
from www import app


def global_init():
    mongoengine.register_connection(
        alias=app.config["DEFAULT_DATABASE_ALIAS"],
        name=app.config["DEFAULT_DATABASE_NAME"]
    )
