from database.models.Task import Task
from mongoengine.queryset.visitor import Q
import mongoengine
from typing import List


def fetch_user_tasks(user_id: mongoengine.ObjectIdField) -> List[Task]:
    query = Task.objects(task_owner_user_id=user_id)
    tasks = list(query)
    return tasks
