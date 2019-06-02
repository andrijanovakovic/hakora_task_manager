import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
	return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const can_enter = isAuthenticated();
	return (
		<Route
			{...rest}
			render={(props) =>
				can_enter === true ? (
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
};

export default ProtectedRoute;
