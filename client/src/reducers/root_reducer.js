import { combineReducers } from "redux";
import user_reducer from "./user_reducer";
import task_reducer from "./app_reducer";

const root_reducer = combineReducers({
	user: user_reducer,
	app: task_reducer,
});

export default root_reducer;
