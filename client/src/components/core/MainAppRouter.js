import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// req handler
import axios from "axios";

// css
import "../../css/MainAppRouter.css";

// route that requires authentication
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouter from "./ProtectedRouter";

// components
import Home from "../Home";
// import About from "../About";
import Login from "../Login";
import Register from "../Register";
import ActivateUser from "../ActivateUser";

// configure axios
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.clear();
		}
        return error;
	},
);
axios.interceptors.request.use(function(config) {
	const token = localStorage.getItem("token");
	config.headers.authorization = `Bearer ${token}`;
	return config;
});

class MainAppRouter extends React.Component {
	render() {
		return (
			<Router>
				<div className={"main_app_router"}>
					<Switch>
						<Route exact path="/" component={Home} />
						{/* <Route exact path="/about" component={About} /> */}
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/activate_user/:active_hash" component={ActivateUser} />
						<ProtectedRoute path="/app" component={ProtectedRouter} />
						<Redirect to="/" />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default MainAppRouter;
