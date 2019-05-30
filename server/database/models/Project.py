"""
    PROJECT MODEL
"""

from app import app
from mongoengine import Document, StringField, ObjectIdField, DateTimeField, signals
import datetime


class Project(Document):
    title = StringField(required=True)
    description = StringField(required=True)
    status = StringField(required=True)  # TODO: define project statuses somewhere

    project_creator_user_id = ObjectIdField(required=True)
    project_leader_user_id = ObjectIdField(required=True)

    created_at = DateTimeField(required=True, default=datetime.datetime.now())
    updated_at = DateTimeField(required=False, default=datetime.datetime.now())

    # TODO: Project members need to be defined somewhere

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'projects',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()


signals.pre_save.connect(Project.pre_save, sender=Project)
