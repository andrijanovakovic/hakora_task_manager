"""
    main entry file for app config
"""


class Helpers:
    @staticmethod
    def get_app_default_url(https_protocol, host, port):
        protocol = "https" if https_protocol else "http"
        return protocol + "://" + host + ":" + str(port)

    @staticmethod
    def get_client_full_url(https_protocol, host, port):
        protocol = "https" if https_protocol else "http"
        return protocol + "://" + host + ":" + str(port)


class Config(object):
    DEFAULT_PORT = 5555
    DEFAULT_API_ENDPOINT = "api"
    DEFAULT_DATABASE_ALIAS = "hakora"
    DEFAULT_DATABASE_NAME = "hakora"
    MAILBOX_LAYER_API_KEY = "<ENTER_YOUR_MAILBOX_API_KEY_HERE>"
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = '<ENTER_YOUR_GMAIL_HERE>'
    MAIL_PASSWORD = '<ENTER_YOUR_GMAIL_PASSWORD_HERE>'
    DEFAULT_EMAIL_SENDER_ACCOUNT = '<ENTER_DEFAULT_EMAIL_SENDER_HERE>'
    DEFAULT_EMAIL_BODY_ENDING = '\n\n\nThis is an automated message sent by a computer. Please do not reply.'


class ProductionConfig(Config, Helpers):
    DEBUG = False
    DEFAULT_PORT = 443
    DEFAULT_PORT_HTTPS = 443
    DEFAULT_PORT_HTTP = 80
    DEFAULT_HOST = "localhost"
    USES_HTTPS = False
    DEFAULT_URL = Helpers.get_app_default_url(USES_HTTPS, DEFAULT_HOST, DEFAULT_PORT)
    CLIENT_FULL_URL = Helpers.get_client_full_url(USES_HTTPS, DEFAULT_HOST, DEFAULT_PORT)


class DevelopmentConfig(Config, Helpers):
    DEFAULT_PORT = 5555
    DEBUG = True
    DEFAULT_HOST = "localhost"
    USES_HTTPS = False
    DEFAULT_URL = Helpers.get_app_default_url(USES_HTTPS, DEFAULT_HOST, DEFAULT_PORT)
    DEFAULT_CLIENT_PORT = 3000
    CLIENT_FULL_URL = Helpers.get_client_full_url(USES_HTTPS, DEFAULT_HOST, DEFAULT_CLIENT_PORT)

