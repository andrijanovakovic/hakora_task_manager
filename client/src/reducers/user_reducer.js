import {
	ACTIVATE_USER_FAIL,
	ACTIVATE_USER_SUCCESS,
	ACTIVATE_USER_LOADING,
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

const initialState = {
	user_activation_loading: false,
	user_activation_data: [],
	user_activation_fail: [],
	user_registration_loading: false,
	user_registration_data: [],
	user_registration_fail: [],
	user_login_loading: false,
	user_login_data: [],
	user_login_fail: [],
	check_token_valid_loading: false,
	check_token_valid_data: [],
	check_token_valid_fail: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case ACTIVATE_USER_LOADING:
			return { ...state, user_activation_loading: true, user_activation_data: [], user_activation_fail: [] };
		case ACTIVATE_USER_SUCCESS:
			return { ...state, user_activation_loading: false, user_activation_data: action.payload, user_activation_fail: [] };
		case ACTIVATE_USER_FAIL:
			return { ...state, user_activation_loading: false, user_activation_data: [], user_activation_fail: action.payload };

		case USER_REGISTRATION_LOADING:
			return { ...state, user_registration_loading: true, user_registration_data: [], user_registration_fail: [] };
		case USER_REGISTRATION_SUCCESS:
			return { ...state, user_registration_loading: false, user_registration_data: action.payload, user_registration_fail: [] };
		case USER_REGISTRATION_FAIL:
			return { ...state, user_registration_loading: false, user_registration_data: [], user_registration_fail: action.payload };

		case USER_LOGIN_LOADING:
			return { ...state, user_login_loading: true, user_login_data: [], user_login_fail: [] };
		case USER_LOGIN_SUCCESS:
			return { ...state, user_login_loading: false, user_login_data: action.payload, user_login_fail: [] };
		case USER_LOGIN_FAIL:
			return { ...state, user_login_loading: false, user_login_data: [], user_login_fail: action.payload };

		case CHECK_TOKEN_VALID_LOADING:
			return { ...state, check_token_valid_loading: true, check_token_valid_data: [], check_token_valid_fail: [] };
		case CHECK_TOKEN_VALID_SUCCESS:
			return { ...state, check_token_valid_loading: false, check_token_valid_data: action.payload, check_token_valid_fail: [] };
		case CHECK_TOKEN_VALID_FAIL:
			return { ...state, check_token_valid_loading: false, check_token_valid_data: [], check_token_valid_fail: action.payload };

		default:
			return state;
	}
}
