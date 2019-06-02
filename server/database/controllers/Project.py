import mongoengine
from database.models.ProjectMember import ProjectMember
from database.models.Project import Project
from typing import List


def fetch_user_projects(user_id: mongoengine.ObjectIdField) -> List[Project]:
    query = ProjectMember.objects(user_id=user_id)
    user_is_member_of = list(query)
    a = 1
    return user_is_member_of
