"""
    Main entry file for the backend
"""

# import flask framework
from flask import Flask
import os
from flask_mail import Mail
from utilities.json_encoder import MongoEngineJSONEncoder

# instantiate our app
app = Flask(__name__)

app.json_encoder = MongoEngineJSONEncoder

# config our app
app.config.from_object('config.DevelopmentConfig')

# mailer instant
mail = Mail(app)

# set root directory
SERVER_ROOT_DIRECTORY = os.getcwd().replace(';', '')

# import routes
from routes import *
