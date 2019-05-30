import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// css
import "../../css/MainAppRouter.css";

// route that requires authentication
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouter from './ProtectedRouter';

// components
import Home from "../Home";
import About from '../About';
import Login from "../Login";
import Register from '../Register';

class MainAppRouter extends React.Component {
	render() {
		return (
			<Router>
				<div className={"main_app_router"}>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/about" component={About} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<ProtectedRoute path="/app" component={ProtectedRouter} />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default MainAppRouter;
