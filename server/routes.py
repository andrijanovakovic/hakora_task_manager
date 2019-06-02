"""
    main routing happens here
"""

from www import app
from flask import send_file

if not app.config['DEBUG']:
    @app.route('/', methods=["GET"])
    def send_client_build_dir():
        return send_file('../build/index.html')

# import auth routes
from routing.User import *
from routing.Task import *
from routing.Projects import *
