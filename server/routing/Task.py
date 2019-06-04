from utilities.wrappers import jwt_required
from www import app
from flask import jsonify, request
import json
from database.controllers.Task import fetch_user_tasks
from database.controllers.Project import fetch_user_projects
from database.models.Task import Task
from database.models.TaskMember import TaskMember
from bson import ObjectId
import datetime
from database.models.Project import Project
from database.models.TaskStatus import TaskStatus
from database.models.User import User
from mongoengine.queryset.visitor import Q


@app.route('/api/tasks/get_my_tasks', methods=["GET"])
@jwt_required
def get_my_tasks(current_user=None):
    tasks = fetch_user_tasks(current_user.id)
    return jsonify({"success": True, "data": tasks}), 200


@app.route('/api/tasks/can_create', methods=["POST"])
@jwt_required
def user_can_create_a_task(current_user=None):
    user_projects = fetch_user_projects(current_user.id)
    if len(user_projects):
        return jsonify({"success": True, "can_create": True, "projects": user_projects}), 200
    return jsonify({"success": True, "can_create": False}), 200


@app.route('/api/tasks/create_new_task', methods=["POST"])
@jwt_required
def create_new_task(current_user=None):
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    if 'task' not in reqb:
        return jsonify({"success": False, "message": "No task data provided!"}), 500

    t = reqb['task']

    task = Task()
    task.title = t["title"]
    task.description = t["description"]
    task.status = t["task_status"]["status_id"]
    task.finished = False
    task.task_owner_user_id = ObjectId(t["task_owner"]["id"])
    task.task_creator_user_id = current_user.id
    task.project_id = ObjectId(t["project"]["id"])
    task.start_date = datetime.datetime.utcnow()
    # task.planned_end_date = datetime.datetime.strptime(t["planned_end_date"], app.config['DEFAULT_DATETIME_FORMAT'])
    task.planned_end_date = t["planned_end_date"]
    task.save()

    for task_member in t["task_members"]:
        member = TaskMember()
        member.task_id = task.id
        member.user_id = ObjectId(task_member["id"])
        member.save()

    return jsonify({"success": True, "message": "Task successfully created!"}), 200


@app.route('/api/tasks/<task_id>', methods=["GET"])
@jwt_required
def get_task_details(current_user=None, task_id=None):
    if not task_id:
        return jsonify({"success": False, "message": "No task_id provided!"}), 500

    task = Task.objects(id=ObjectId(task_id)).first()
    if not task:
        return jsonify({"success": False, "message": "Task does not exist!"}), 500

    if not current_user.id == task.task_owner_user_id and not current_user.id == task.task_creator_user_id:
        return jsonify({"success": False, "message": "No auth!"}), 403

    # convert to manipulatible dict
    task = json.loads(task.to_json())

    # fetch aditional data
    task["project"] = Project.objects(id=ObjectId(task["project_id"]["$oid"])).first()
    task["task_status"] = TaskStatus.objects(
        Q(project_id=ObjectId(task["project_id"]["$oid"])) & Q(status_id=task["status"])).first()
    task["task_creator"] = User.objects(id=ObjectId(task["task_creator_user_id"]["$oid"])).exclude('password').first()
    task["task_owner"] = User.objects(id=ObjectId(task["task_owner_user_id"]["$oid"])).exclude('password').first()

    return jsonify({"success": True, "task": task}), 200


@app.route('/api/tasks/update', methods=["POST"])
@jwt_required
def update_task(current_user=None):
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    if 'task_id' not in reqb:
        return jsonify({"success": False, "message": "No task_id provided!"}), 500
    if 'task_values' not in reqb:
        return jsonify({"success": False, "message": "No task_values provided!"}), 500

    t_id = reqb['task_id']
    t_vl = reqb["task_values"]

    task = Task.objects(id=ObjectId(t_id)).first()
    if not task:
        return jsonify({"success": False, "message": "Task with that ID does not exist!"}), 500

    task.title = t_vl["title"]
    task.description = t_vl["description"]
    task.status = t_vl["task_status"]["status_id"]
    task.task_owner_user_id = ObjectId(t_vl["task_owner"]["id"])
    task.project_id = ObjectId(t_vl["project"]["id"])
    task.planned_end_date = t_vl["planned_end_date"]
    task.end_date = t_vl["end_date"]
    task.save()

    TaskMember.objects(task_id=task.id).delete()

    for task_member in t_vl["task_members"]:
        member = TaskMember()
        member.task_id = task.id
        member.user_id = ObjectId(task_member["id"])
        member.save()

    return jsonify({"success": True, "message": "Successfully updated!"}), 200
