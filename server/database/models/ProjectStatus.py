"""
    HERE ARE DEFINED ALL AVAILABLE STATUSES FOR A PROJECT
"""

from www import app
import mongoengine
import datetime


class ProjectStatus(mongoengine.Document):
    project_id = mongoengine.ObjectIdField(required=True)
    status = mongoengine.StringField(required=True)

    created_at = mongoengine.DateTimeField(required=True, default=datetime.datetime.now)
    updated_at = mongoengine.DateTimeField(required=False, default=datetime.datetime.now)

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'project_statuses',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()


mongoengine.signals.pre_save.connect(ProjectStatus.pre_save, sender=ProjectStatus)
