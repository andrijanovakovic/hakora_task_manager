import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
	if (localStorage.getItem("token")) {
		return true;
	}
	return false;
};

const ProtectedRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			isAuthenticated === true ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/login",
						state: { from: props.location },
					}}
				/>
			)
		}
	/>
);

export default ProtectedRoute;
