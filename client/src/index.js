import React from "react";
import ReactDOM from "react-dom";

// browser magic
import * as serviceWorker from "./serviceWorker";

// for app store
import { createStore, applyMiddleware } from "redux";

// thunk middleware for redux
import thunk from "redux-thunk";

// one reducer to rule them all
import rootReducer from "./reducers/root_reducer";

// provides app store to whole app
import { Provider } from "react-redux";

// main app component
import MainAppRouter from "./components/core/MainAppRouter";
import "./css/index.css";

// toast messages
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
	hideProgressBar: true,
	closeOnClick: false,
	closeButton: false,
});

// create app store
const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
	<Provider store={store}>
		<MainAppRouter />
	</Provider>,
	document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
