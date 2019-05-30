"""
    THE BACKEND IS STARTED FROM THIS FILE
"""

from www import app
from database import global_init

# connect/init db
db = global_init()

# run the app
if __name__ == "__main__":
    app.run(
        debug=app.config["DEBUG"],
        host=app.config["DEFAULT_HOST"],
        port=app.config["DEFAULT_PORT"],
        threaded=True,
        use_reloader=False
    )
