from www import app
import mongoengine
import datetime


class TaskMember(mongoengine.Document):
    task_id = mongoengine.ObjectIdField(required=True)
    user_id = mongoengine.ObjectIdField(required=True)

    created_at = mongoengine.DateTimeField(required=True, default=datetime.datetime.now)
    updated_at = mongoengine.DateTimeField(required=False, default=datetime.datetime.now)

    meta = {
        'db_alias': app.config["DEFAULT_DATABASE_ALIAS"],
        'collection': 'task_members',
    }

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()


mongoengine.signals.pre_save.connect(TaskMember.pre_save, sender=TaskMember)
