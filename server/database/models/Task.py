"""
    TASKS MODEL
"""

from app import app
import mongoengine
import datetime


class Task(mongoengine.Document):
    title = mongoengine.StringField(required=True)
    description = mongoengine.StringField(required=True)
    status = mongoengine.StringField(required=True)  # TODO: Define available statuses somewhere
    finished = mongoengine.BooleanField(required=True, default=False)

    task_owner_user_id = mongoengine.ObjectIdField(required=True)  # the one who is doing the task
    task_creator_user_id = mongoengine.ObjectIdField(required=True)  # the one who created the task

    project_id = mongoengine.ObjectIdField(required=True)

    created_at = mongoengine.DateTimeField(required=True, default=datetime.datetime.now())
    updated_at = mongoengine.DateTimeField(required=False, default=datetime.datetime.now())

    # TODO: Task members need to be defined somewhere

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'tasks',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()


mongoengine.signals.pre_save.connect(Task.pre_save, sender=Task)
