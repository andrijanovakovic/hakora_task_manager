from www import app
import mongoengine
import datetime


class ProjectMember(mongoengine.Document):
    project_id = mongoengine.ObjectIdField(required=True)
    user_id = mongoengine.ObjectIdField(required=True)

    created_at = mongoengine.DateTimeField(required=True, default=datetime.datetime.utcnow())
    updated_at = mongoengine.DateTimeField(required=False, default=datetime.datetime.utcnow())

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'project_members',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.utcnow()


mongoengine.signals.pre_save.connect(ProjectMember.pre_save, sender=ProjectMember)

"""
from www import app
import mongoengine
import datetime


class TaskMember(mongoengine.Document):
    task_id = mongoengine.ObjectIdField(required=True)
    user_id = mongoengine.ObjectIdField(required=True)

    created_at = mongoengine.DateTimeField(required=True, default=datetime.datetime.utcnow())
    updated_at = mongoengine.DateTimeField(required=False, default=datetime.datetime.utcnow())

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'task_members',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.utcnow()


mongoengine.signals.pre_save.connect(TaskMember.pre_save, sender=TaskMember)


"""