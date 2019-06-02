import axios from "axios";

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
				console.error(err);
				dispatch({ type: GET_MY_TASKS_FAIL, payload: err.response && err.response.data ? err.response.data : null });
			});
	};
};

export const check_if_user_can_create_task = () => {
	return (dispatch) => {
		dispatch({ type: CHECK_IF_USER_CAN_CREATE_TASK_LOADING });
		axios
			.post("/api/tasks/can_create")
			.then((res) => {
				if (res.data.projects) {
					dispatch({ type: GET_MY_PROJECTS_SUCCESS, payload: res.data.projects });
				}
				dispatch({ type: CHECK_IF_USER_CAN_CREATE_TASK_SUCCESS, payload: res.data.can_create });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: CHECK_IF_USER_CAN_CREATE_TASK_FAIL, payload: err.response && err.response.data ? err.response.data : null });
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
				console.error(err);
				dispatch({ type: GET_MY_PROJECTS_FAIL, payload: err.response && err.response.data ? err.response.data : null });
			});
	};
};
