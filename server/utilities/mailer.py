"""
    MAILER UTILITY
"""

from flask_mail import Message
from www import mail, app


def send_email_without_template(email_title: str, email_body: str, email_recipients: list):
    try:
        msg = Message(
            email_title,
            sender=app.config["DEFAULT_EMAIL_SENDER_ACCOUNT"],
            recipients=email_recipients,
            body=email_body + app.config['DEFAULT_EMAIL_BODY_ENDING']
        )

        mail.send(msg)

        return {"success": True}

    except Exception as e:
        return {"success": False, "message": str(e)}
