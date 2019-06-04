import axios from "axios";
import { toast } from "react-toastify";

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
	CHECK_TOKEN_VALID_LOADING,
	CHECK_TOKEN_VALID_SUCCESS,
	CHECK_TOKEN_VALID_FAIL,
} from "../types/user_types";

export const login_user = (user_data) => {
	return (dispatch) => {
		dispatch({ type: USER_LOGIN_LOADING });
		axios
			.post("/api/auth/login", user_data)
			.then((res) => {
				if (res.response && res.response.status !== 200 && res.response.data.success === false) {
					dispatch({ type: USER_LOGIN_FAIL, payload: res.response && res.response.data ? res.response.data : [] });
				} else {
					dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
				}
			})
			.catch((err) => {
				toast.error("Error occurred while trying to sign you in, please try again later...");
				console.error(err);
				dispatch({ type: USER_LOGIN_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const register_new_user = (user_data) => {
	return (dispatch) => {
		dispatch({ type: USER_REGISTRATION_LOADING });
		axios
			.post("/api/auth/register", user_data)
			.then((res) => {
				if (res.response && res.response.status !== 200 && res.response.data.success === false) {
					dispatch({ type: USER_REGISTRATION_FAIL, payload: res.response && res.response.data ? res.response.data : [] });
				} else {
					dispatch({ type: USER_REGISTRATION_SUCCESS, payload: res.data });
				}
			})
			.catch((err) => {
				toast.error("Error occurred while trying to register you in, please try again later...");
				console.error(err);
				dispatch({ type: USER_REGISTRATION_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
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
				toast.error("Error occurred while trying to activate your account, please try again later...");
				console.error(err);
				dispatch({ type: ACTIVATE_USER_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};

export const check_token_valid = () => {
	return (dispatch) => {
		dispatch({ type: CHECK_TOKEN_VALID_LOADING });
		axios
			.post("/api/auth/check_token_valid")
			.then((res) => {
				if (res && res.data) {
					dispatch({ type: CHECK_TOKEN_VALID_SUCCESS, payload: res.data });
				} else {
					dispatch({ type: CHECK_TOKEN_VALID_FAIL });
				}
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: CHECK_TOKEN_VALID_FAIL, payload: err.response && err.response.data ? err.response.data : [] });
			});
	};
};
