import mongoengine
from database.models.ProjectMember import ProjectMember
from database.models.Project import Project
from database.models.User import User
from database.models.Task import Task
from typing import List
from bson import ObjectId
import json


def fetch_user_projects(user_id: mongoengine.ObjectIdField) -> List[Project]:
    # query for fetching project id's of which user is owner or participating member
    project_ids_query = ProjectMember.objects(user_id=user_id).values_list('project_id')

    # in here are now stored project id's of which user is owner or participating member
    user_is_member_of = list(project_ids_query)

    # finally execute projects query
    projects_query = Project.objects().filter(id__in=user_is_member_of)

    # convert to list of objects
    projects = list(projects_query)

    final_projects = []

    # execute query for each project
    for project in projects:
        # convert to manipulatible dict
        project = json.loads(project.to_json())

        # fetch project creator
        project["project_creator"] = User.objects(id=ObjectId(project["project_creator_user_id"]["$oid"])).exclude(
            'password').first()

        # fetch project leader
        project["project_leader"] = User.objects(id=ObjectId(project["project_leader_user_id"]["$oid"])).exclude(
            'password').first()

        # build project members query and execute to get project members
        project_members_user_ids_query = ProjectMember.objects(project_id=ObjectId(project["_id"]["$oid"])).values_list(
            'user_id')
        project_members_user_ids = list(project_members_user_ids_query)
        project_members = User.objects().filter(id__in=project_members_user_ids).exclude('password')
        project["project_members"] = project_members

        # get project tasks
        project["tasks"] = Task.objects(project_id=ObjectId(project["_id"]["$oid"]))

        # add to response
        final_projects.append(project)

    return final_projects
