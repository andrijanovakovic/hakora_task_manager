import { GET_MY_TASKS_LOADING, GET_MY_TASKS_SUCCESS, GET_MY_TASKS_FAIL } from "../types/app_types";

const initialState = {
	my_tasks_loading: false,
	my_tasks_data: [],
	my_tasks_fail: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_MY_TASKS_LOADING:
			return { ...state, my_tasks_loading: true, my_tasks_data: [], my_tasks_fail: [] };
		case GET_MY_TASKS_SUCCESS:
			return { ...state, my_tasks_loading: false, my_tasks_data: action.payload, my_tasks_fail: [] };
		case GET_MY_TASKS_FAIL:
			return { ...state, my_tasks_loading: false, my_tasks_data: [], my_tasks_fail: action.payload };

		default:
			return state;
	}
}
