import { combineReducers } from "redux";
import user_reducer from "./user_reducer";

const root_reducer = combineReducers({
	user: user_reducer,
});

export default root_reducer;
