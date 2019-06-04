"""
    PROJECT MODEL
"""

from www import app
from mongoengine import Document, StringField, ObjectIdField, DateTimeField, signals
import datetime


class Project(Document):
    title = StringField(required=True)
    description = StringField(required=True)

    project_creator_user_id = ObjectIdField(required=True)
    project_leader_user_id = ObjectIdField(required=True)

    created_at = DateTimeField(required=True, default=datetime.datetime.utcnow())
    updated_at = DateTimeField(required=False, default=datetime.datetime.utcnow())

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'projects',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.utcnow()


signals.pre_save.connect(Project.pre_save, sender=Project)
