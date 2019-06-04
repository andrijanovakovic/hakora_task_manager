from database.models.Task import Task
import mongoengine
from typing import List
import json
from database.models.Project import Project
from bson import ObjectId
from database.models.TaskStatus import TaskStatus
from mongoengine.queryset.visitor import Q
from database.models.User import User


def fetch_user_tasks(user_id: mongoengine.ObjectIdField) -> List[Task]:
    query = Task.objects(task_owner_user_id=user_id)
    tasks = list(query)

    tasks_final = []

    for task in tasks:
        # convert to manipulatible dict
        task = json.loads(task.to_json())

        # fetch aditional data
        task["project"] = Project.objects(id=ObjectId(task["project_id"]["$oid"])).first()
        task["task_status"] = TaskStatus.objects(
            Q(project_id=ObjectId(task["project_id"]["$oid"])) & Q(status_id=task["status"])).first()
        task["task_creator"] = User.objects(id=ObjectId(task["task_creator_user_id"]["$oid"])).exclude(
            'password').first()
        task["task_owner"] = User.objects(id=ObjectId(task["task_owner_user_id"]["$oid"])).exclude('password').first()

        # append to response object
        tasks_final.append(task)

    return tasks_final
