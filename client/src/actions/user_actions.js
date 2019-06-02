import axios from "axios";

// types
import {
	ACTIVATE_USER_FAIL,
	ACTIVATE_USER_LOADING,
	ACTIVATE_USER_SUCCESS,
	USER_REGISTRATION_SUCCESS,
	USER_REGISTRATION_LOADING,
	USER_REGISTRATION_FAIL,
	USER_LOGIN_LOADING,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
} from "../types/user_types";

export const login_user = (user_data) => {
	return (dispatch) => {
		dispatch({ type: USER_LOGIN_LOADING });
		axios
			.post("/api/auth/login", user_data)
			.then((res) => {
				dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: USER_LOGIN_FAIL, payload: err.response && err.response.data ? err.response.data : null });
			});
	};
};

export const register_new_user = (user_data) => {
	return (dispatch) => {
		dispatch({ type: USER_REGISTRATION_LOADING });
		axios
			.post("/api/auth/register", user_data)
			.then((res) => {
				dispatch({ type: USER_REGISTRATION_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: USER_REGISTRATION_FAIL, payload: err.response && err.response.data ? err.response.data : null });
			});
	};
};

export const activate_user = (active_hash) => {
	return (dispatch) => {
		dispatch({ type: ACTIVATE_USER_LOADING });
		axios
			.post("/api/auth/activate", { active_hash })
			.then((res) => {
				dispatch({ type: ACTIVATE_USER_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: ACTIVATE_USER_FAIL, payload: err.response && err.response.data ? err.response.data : null });
			});
	};
};
