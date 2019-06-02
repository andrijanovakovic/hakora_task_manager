from utilities.wrappers import jwt_required
from www import app
from flask import jsonify
from database.controllers.Task import fetch_user_tasks
from database.controllers.Project import fetch_user_projects


@app.route('/api/tasks/get_my_tasks', methods=["GET"])
@jwt_required
def get_my_tasks(current_user=None):
    tasks = fetch_user_tasks(current_user.id)
    return jsonify({"success": True, "data": tasks}), 200


@app.route('/api/tasks/can_create', methods=["POST"])
@jwt_required
def user_can_create_a_task(current_user=None):
    user_projects = fetch_user_projects(current_user.id)
    a = 1
    return jsonify({"success": True})
