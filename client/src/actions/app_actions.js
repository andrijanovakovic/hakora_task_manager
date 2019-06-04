import axios from "axios";
import { toast } from "react-toastify";

import {
	GET_MY_TASKS_LOADING,
	GET_MY_TASKS_SUCCESS,
	GET_MY_TASKS_FAIL,
	CHECK_IF_USER_CAN_CREATE_TASK_LOADING,
	CHECK_IF_USER_CAN_CREATE_TASK_SUCCESS,
	CHECK_IF_USER_CAN_CREATE_TASK_FAIL,
	GET_MY_PROJECTS_SUCCESS,
	GET_MY_PROJECTS_LOADING,
	GET_MY_PROJECTS_FAIL,
	CREATE_NEW_PROJECT_LOADING,
	CREATE_NEW_PROJECT_SUCCESS,
	CREATE_NEW_PROJECT_FAIL,
	CREATE_NEW_TASK_LOADING,
	CREATE_NEW_TASK_SUCCESS,
	CREATE_NEW_TASK_FAIL,
	GET_TASK_DETAILS_LOADING,
	GET_TASK_DETAILS_SUCCESS,
	GET_TASK_DETAILS_FAIL,
	UPDATE_TASK_LOADING,
	UPDATE_TASK_SUCCESS,
	UPDATE_TASK_FAIL,
	GET_PROJECT_DETAILS_LOADING,
	GET_PROJECT_DETAILS_SUCCESS,
	GET_PROJECT_DETAILS_FAIL,
	UPDATE_PROJECT_LOADING,
	UPDATE_PROJECT_SUCCESS,
	UPDATE_PROJECT_FAIL,
} from "../types/app_types";

export const get_my_tasks = () => {
	return (dispatch) => {
		dispatch({ type: GET_MY_TASKS_LOADING });
		axios
			.get("/api/tasks/get_my_tasks")
			.then((res) => {
				dispatch({ type: GET_MY_TASKS_SUCCESS, payload: res.data.data });
			})
			.catch((err) => {
				toast.error("Error occurred while trying to fetch your tasks, please try again later...");
				console.error(err);
				dispatch({ type: GET_MY_TASKS_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const check_if_user_can_create_task = (cb = null) => {
	return (dispatch) => {
		dispatch({ type: CHECK_IF_USER_CAN_CREATE_TASK_LOADING });
		axios
			.post("/api/tasks/can_create")
			.then((res) => {
				if (res.data.projects) {
					dispatch({ type: GET_MY_PROJECTS_SUCCESS, payload: res.data.projects });
				}

				if (!res.data.can_create) {
					toast.error("You don't have any projects, please create a project before creating a task.");
				}

				dispatch({ type: CHECK_IF_USER_CAN_CREATE_TASK_SUCCESS, payload: res.data.can_create });

				if (cb) {
					cb(res.data.can_create);
				}
			})
			.catch((err) => {
				toast.error("Error occurred while trying to find out if you can create a task, please try again later...");
				console.error(err);
				dispatch({ type: CHECK_IF_USER_CAN_CREATE_TASK_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const fetch_my_projects = () => {
	return (dispatch) => {
		dispatch({ type: GET_MY_PROJECTS_LOADING });
		axios
			.get("/api/projects/get_my_projects")
			.then((res) => {
				dispatch({ type: GET_MY_PROJECTS_SUCCESS, payload: res.data.data });
			})
			.catch((err) => {
				toast.error("Error occurred while trying to fetch your projects, please try again later...");
				console.error(err);
				dispatch({ type: GET_MY_PROJECTS_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const create_new_project = (project) => {
	return (dispatch) => {
		dispatch({ type: CREATE_NEW_PROJECT_LOADING });
		axios
			.post("/api/projects/create_new_project", {
				data: project,
			})
			.then((res) => {
				dispatch({ type: CREATE_NEW_PROJECT_SUCCESS, payload: res.data.success });
			})
			.catch((err) => {
				toast.error("Error occurred while trying to create a new project, please try again later...");
				console.error(err);
				dispatch({ type: CREATE_NEW_PROJECT_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const create_new_task = (task) => {
	return (dispatch) => {
		dispatch({ type: CREATE_NEW_TASK_LOADING });
		axios
			.post("/api/tasks/create_new_task", {
				task,
			})
			.then((res) => {
				dispatch({ type: CREATE_NEW_TASK_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				toast.error("Error occurred while trying to create a new task, please try again later...");
				console.error(err);
				dispatch({ type: CREATE_NEW_TASK_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const get_task_details = (task_id) => {
	return (dispatch) => {
		dispatch({ type: GET_TASK_DETAILS_LOADING });
		axios
			.get("/api/tasks/" + task_id)
			.then((res) => {
				dispatch({ type: GET_TASK_DETAILS_SUCCESS, payload: res.data.task });
			})
			.catch((err) => {
				toast.error("Error occurred while trying to fetch task details, please try again later...");
				console.error(err);
				dispatch({ type: GET_TASK_DETAILS_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const update_task = (id, values) => {
	return (dispatch) => {
		dispatch({ type: UPDATE_TASK_LOADING });
		axios
			.post("/api/tasks/update", {
				task_id: id,
				task_values: values,
			})
			.then((res) => {
				if (res.response && res.response.status !== 200 && res.response.data.success === false) {
					dispatch({ type: UPDATE_TASK_FAIL, payload: res.response && res.response.data ? res.response.data : [] });
				} else {
					dispatch({ type: UPDATE_TASK_SUCCESS, payload: res.data });
				}
			})
			.catch((err) => {
				toast.error("Error occurred while trying to update task details, please try again later...");
				console.error(err);
				dispatch({ type: UPDATE_TASK_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const update_project = (id, values) => {
	return (dispatch) => {
		dispatch({ type: UPDATE_PROJECT_LOADING });
		axios
			.post("/api/projects/update", {
				project_id: id,
				project_values: values,
			})
			.then((res) => {
				if (res.response && res.response.status !== 200 && res.response.data.success === false) {
					dispatch({ type: UPDATE_PROJECT_FAIL, payload: res.response && res.response.data ? res.response.data : [] });
				} else {
					dispatch({ type: UPDATE_PROJECT_SUCCESS, payload: res.data });
				}
			})
			.catch((err) => {
				toast.error("Error occurred while trying to update project details, please try again later...");
				console.error(err);
				dispatch({ type: UPDATE_PROJECT_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const get_project_details = (project_id) => {
	return (dispatch) => {
		dispatch({ type: GET_PROJECT_DETAILS_LOADING });
		axios
			.get("/api/projects/" + project_id)
			.then((res) => {
				dispatch({ type: GET_PROJECT_DETAILS_SUCCESS, payload: res.data.project });
			})
			.catch((err) => {
				toast.error("Error occurred while trying to fetch project details, please try again later...");
				console.error(err);
				dispatch({ type: GET_PROJECT_DETAILS_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};
