"""
    HERE ARE DEFINED ALL AVAILABLE STATUSES FOR A TASK
"""

from www import app
import mongoengine
import datetime


class TaskStatus(mongoengine.Document):
    project_id = mongoengine.ObjectIdField(required=True)
    status_id = mongoengine.StringField(required=True)
    status = mongoengine.StringField(required=True)

    created_at = mongoengine.DateTimeField(required=True, default=datetime.datetime.utcnow())
    updated_at = mongoengine.DateTimeField(required=False, default=datetime.datetime.utcnow())

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'task_statuses',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.utcnow()


mongoengine.signals.pre_save.connect(TaskStatus.pre_save, sender=TaskStatus)
