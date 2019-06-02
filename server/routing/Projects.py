from www import app
from utilities.wrappers import jwt_required
from flask import jsonify
from database.controllers.Project import fetch_user_projects
from database.models.Project import Project
from database.models.ProjectMember import ProjectMember


@app.route('/api/projects/get_my_projects', methods=["GET"])
@jwt_required
def get_my_projects(current_user=None):
    projects = fetch_user_projects(current_user.id)
    return jsonify({"success": True, "data": projects}), 200


@app.route('/api/projects/create_new_project', methods=["POST"])
@jwt_required
def create_new_project(current_user=None):
    return jsonify({"success": True}), 200
