# pip
from flask import request, jsonify
import json
from bson import ObjectId

# app
from www import app
from utilities.wrappers import jwt_required

# db models
from database.models.TaskMember import TaskMember
from database.models.User import User


@app.route("/api/task_members/get_task_members_for_task", methods=['POST'])
@jwt_required
def get_task_members_for_task(current_user=None):
    if len(request.data) == 0:
        return jsonify({"success": False, "message": "No data provided!"}), 500

    reqb = json.loads(request.data)

    if 'task_id' not in reqb:
        return jsonify({"success": False, "message": "No task_id provided!"}), 500

    # build task members query and execute to get task members
    task_members_ids_query = TaskMember.objects(task_id=ObjectId(reqb["task_id"])).values_list('user_id')
    task_members_ids = list(task_members_ids_query)
    task_members = User.objects().filter(id__in=task_members_ids).exclude('password')

    return jsonify({"success": True, "data": task_members}), 200
