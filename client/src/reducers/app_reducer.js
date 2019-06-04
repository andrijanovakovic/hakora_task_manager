import {
	GET_MY_TASKS_LOADING,
	GET_MY_TASKS_SUCCESS,
	GET_MY_TASKS_FAIL,
	CREATE_NEW_PROJECT_LOADING,
	CREATE_NEW_PROJECT_SUCCESS,
	CREATE_NEW_PROJECT_FAIL,
	GET_MY_PROJECTS_SUCCESS,
	GET_MY_PROJECTS_LOADING,
	GET_MY_PROJECTS_FAIL,
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

const initialState = {
	my_tasks_loading: false,
	my_tasks_data: [],
	my_tasks_fail: [],
	create_new_project_loading: false,
	create_new_project_data: [],
	create_new_project_fail: [],
	my_projects_loading: false,
	my_projects_data: [],
	my_projects_fail: [],
	create_new_task_loading: false,
	create_new_task_data: [],
	create_new_task_fail: [],
	get_task_details_loading: false,
	get_task_details_data: [],
	get_task_details_fail: [],
	update_task_loading: false,
	update_task_data: [],
	update_task_fail: [],
	project_details_loading: false,
	project_details_data: [],
	project_details_fail: [],
    update_project_loading: false,
    update_project_data: [],
    update_project_fail: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_MY_TASKS_LOADING:
			return { ...state, my_tasks_loading: true, my_tasks_data: [], my_tasks_fail: [] };
		case GET_MY_TASKS_SUCCESS:
			return { ...state, my_tasks_loading: false, my_tasks_data: action.payload, my_tasks_fail: [] };
		case GET_MY_TASKS_FAIL:
			return { ...state, my_tasks_loading: false, my_tasks_data: [], my_tasks_fail: action.payload };

		case CREATE_NEW_PROJECT_LOADING:
			return { ...state, create_new_project_loading: true, create_new_project_data: [], create_new_project_fail: [] };
		case CREATE_NEW_PROJECT_SUCCESS:
			return { ...state, create_new_project_loading: false, create_new_project_data: action.payload, create_new_project_fail: [] };
		case CREATE_NEW_PROJECT_FAIL:
			return { ...state, create_new_project_loading: false, create_new_project_data: [], create_new_project_fail: action.payload };

		case GET_MY_PROJECTS_LOADING:
			return { ...state, my_projects_loading: true, my_projects_data: [], my_projects_fail: [] };
		case GET_MY_PROJECTS_SUCCESS:
			return { ...state, my_projects_loading: false, my_projects_data: action.payload, my_projects_fail: [] };
		case GET_MY_PROJECTS_FAIL:
			return { ...state, my_projects_loading: false, my_projects_data: [], my_projects_fail: action.payload };

		case CREATE_NEW_TASK_LOADING:
			return { ...state, create_new_task_loading: true, create_new_task_data: [], create_new_task_fail: [] };
		case CREATE_NEW_TASK_SUCCESS:
			return { ...state, create_new_task_loading: false, create_new_task_data: action.payload, create_new_task_fail: [] };
		case CREATE_NEW_TASK_FAIL:
			return { ...state, create_new_task_loading: false, create_new_task_data: [], create_new_task_fail: action.payload };

		case GET_TASK_DETAILS_LOADING:
			return { ...state, get_task_details_loading: true, get_task_details_data: [], get_task_details_fail: [] };
		case GET_TASK_DETAILS_SUCCESS:
			return { ...state, get_task_details_loading: false, get_task_details_data: action.payload, get_task_details_fail: [] };
		case GET_TASK_DETAILS_FAIL:
			return { ...state, get_task_details_loading: false, get_task_details_data: [], get_task_details_fail: action.payload };

		case UPDATE_TASK_LOADING:
			return { ...state, update_task_loading: true, update_task_data: [], update_task_fail: [] };
		case UPDATE_TASK_SUCCESS:
			return { ...state, update_task_loading: false, update_task_data: action.payload, update_task_fail: [] };
		case UPDATE_TASK_FAIL:
			return { ...state, update_task_loading: false, update_task_data: [], update_task_fail: action.payload };

		case GET_PROJECT_DETAILS_LOADING:
			return { ...state, project_details_loading: true, project_details_data: [], project_details_fail: [] };
		case GET_PROJECT_DETAILS_SUCCESS:
			return { ...state, project_details_loading: false, project_details_data: action.payload, project_details_fail: [] };
		case GET_PROJECT_DETAILS_FAIL:
			return { ...state, project_details_loading: false, project_details_data: [], project_details_fail: action.payload };

		case UPDATE_PROJECT_LOADING:
			return { ...state, update_project_loading: true, update_project_data: [], update_project_fail: [] };
		case UPDATE_PROJECT_SUCCESS:
			return { ...state, update_project_loading: false, update_project_data: action.payload, update_project_fail: [] };
		case UPDATE_PROJECT_FAIL:
			return { ...state, update_project_loading: false, update_project_data: [], update_project_fail: action.payload };

		default:
			return state;
	}
}
