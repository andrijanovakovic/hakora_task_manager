# pip
from flask import jsonify, request
import json
from bson import ObjectId

# app
from www import app
from utilities.wrappers import jwt_required
from mongoengine.queryset.visitor import Q

# db models
from database.models.Project import Project
from database.models.ProjectMember import ProjectMember
from database.models.ProjectStatus import ProjectStatus
from database.models.User import User
from database.models.TaskStatus import TaskStatus
from database.models.Task import Task

# db controllers
from database.controllers.Project import fetch_user_projects


@app.route('/api/projects/get_my_projects', methods=["GET", "POST"])
@jwt_required
def get_my_projects(current_user=None):
    projects = fetch_user_projects(current_user.id)
    return jsonify({"success": True, "data": projects}), 200


@app.route('/api/projects/create_new_project', methods=["POST"])
@jwt_required
def create_new_project(current_user=None):
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    if 'data' not in reqb:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    data = reqb['data']

    project = Project()
    project.title = data["title"]
    project.description = data["description"]
    project.project_creator_user_id = current_user.id
    project.project_leader_user_id = ObjectId(data["project_leader"]["id"])
    project.save()

    for project_member in data["project_members"]:
        member = ProjectMember()
        member.project_id = project.id
        member.user_id = ObjectId(project_member['id'])
        member.save()

    for project_status in data["project_statuses"]:
        proj_status = ProjectStatus()
        proj_status.project_id = project.id
        proj_status.status = project_status['text']
        proj_status.save()

    for task_status in data["project_task_statuses"]:
        tsk_status = TaskStatus()
        tsk_status.project_id = project.id
        tsk_status.status_id = task_status["id"]
        tsk_status.status = task_status["text"]
        tsk_status.save()

    return jsonify({"success": True}), 200


@app.route('/api/projects/get_project_members', methods=["POST"])
@jwt_required
def get_project_members(current_user=None):
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    if 'project_id' not in reqb:
        return jsonify({"success": False, "message": "No project_id provided!"}), 500

    proj_id_as_object_id = ObjectId(reqb["project_id"])

    # build project members query and execute to get project members
    project_members_user_ids_query = ProjectMember.objects(project_id=proj_id_as_object_id).values_list(
        'user_id')
    project_members_user_ids = list(project_members_user_ids_query)
    project_members = User.objects().filter(id__in=project_members_user_ids).exclude('password')

    return jsonify({"success": False, "data": project_members}), 200


@app.route('/api/projects/get_available_task_statuses_for_project', methods=["POST"])
@jwt_required
def get_available_task_statuses_for_project(current_user=None):
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    if 'project_id' not in reqb:
        return jsonify({"success": False, "message": "No project_id provided!"}), 500

    proj_id_as_object_id = ObjectId(reqb["project_id"])

    task_statuses = TaskStatus.objects(project_id=proj_id_as_object_id)

    return jsonify({"success": True, "data": task_statuses}), 200


@app.route('/api/projects/update', methods=["POST"])
@jwt_required
def update_project(current_user=None):
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    if 'project_id' not in reqb:
        return jsonify({"success": False, "message": "No task_id provided!"}), 500
    if 'project_values' not in reqb:
        return jsonify({"success": False, "message": "No project_values provided!"}), 500

    p_id = reqb['project_id']
    p_vl = reqb["project_values"]

    project = Project.objects(id=ObjectId(p_id)).first()
    if not project:
        return jsonify({"success": False, "message": "Project with that ID does not exist!"}), 500

    project.title = p_vl["title"]
    project.description = p_vl["description"]
    project.project_leader_user_id = ObjectId(p_vl["project_leader"]["id"])
    project.save()

    ProjectMember.objects(project_id=ObjectId(p_id))
    ProjectStatus.objects(project_id=ObjectId(p_id))
    TaskStatus.objects(project_id=ObjectId(p_id))

    for member in p_vl["project_members"]:
        project_member = ProjectMember()
        project_member.project_id = project.id
        project_member.user_id = ObjectId(member['id'])
        project_member.save()

    for status in p_vl["project_statuses"]:
        project_status = ProjectStatus()
        project_status.project_id = project.id
        project_status.status = status['status']
        project_status.save()

    for task_status in p_vl["project_task_statuses"]:
        pts = TaskStatus()
        pts.project_id = project.id
        pts.status_id = task_status["status_id"]
        pts.status = task_status["status"]
        pts.save()

    return jsonify({"success": True, "message": "Successfully updated!"}), 200


@app.route('/api/projects/<project_id>', methods=["GET"])
@jwt_required
def get_project_details(current_user=None, project_id=None):
    if not project_id:
        return jsonify({"success": False, "message": "No project_id provided!"}), 500

    project = Project.objects(id=ObjectId(project_id)).first()
    if not project:
        return jsonify({"success": False, "message": "Project does not exist!"}), 500

    if not current_user.id == project.project_leader_user_id and not current_user.id == project.project_creator_user_id:
        return jsonify({"success": False, "message": "You don't have the rights to view this project!"}), 403

    # convert to manipulatible dict
    project = json.loads(project.to_json())

    # get members
    project_members_user_ids_query = ProjectMember.objects(project_id=ObjectId(project["_id"]["$oid"])).values_list(
        'user_id')
    project_members_user_ids = list(project_members_user_ids_query)
    project_members = User.objects().filter(id__in=project_members_user_ids).exclude('password')
    project["project_members"] = project_members

    # get statuses
    project_statuses = ProjectStatus.objects(project_id=ObjectId(project["_id"]["$oid"]))
    project["project_statuses"] = project_statuses

    # get project task statuses
    project_task_statuses = TaskStatus.objects(project_id=ObjectId(project["_id"]["$oid"]))
    project["project_task_statuses"] = project_task_statuses

    # get tasks
    project_tasks = Task.objects(project_id=ObjectId(project["_id"]["$oid"]))
    project_tasks_final = []
    for task in project_tasks:
        # convert to manipulatible dict
        task = json.loads(task.to_json())

        task["task_status"] = TaskStatus.objects(
            Q(project_id=ObjectId(task["project_id"]["$oid"])) & Q(status_id=task["status"])).first()
        task["task_creator"] = User.objects(id=ObjectId(task["task_creator_user_id"]["$oid"])).exclude(
            'password').first()
        task["task_owner"] = User.objects(id=ObjectId(task["task_owner_user_id"]["$oid"])).exclude('password').first()
        project_tasks_final.append(task)

    project["project_tasks"] = project_tasks_final

    # get project creator data
    project_creator = User.objects(id=ObjectId(project["project_creator_user_id"]["$oid"])).exclude(
        'password').first()
    project["project_creator"] = project_creator

    # get project leader data
    project_leader = User.objects(id=ObjectId(project["project_leader_user_id"]["$oid"])).exclude('password').first()
    project["project_leader"] = project_leader

    return jsonify({"success": True, "project": project}), 200
