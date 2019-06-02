import React from "react";
import "../css/Login.css";
import { Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { login_user } from "../actions/user_actions";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import queryString from "query-string";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			header_subtitle: "",
		};
	}

	componentDidMount() {
		const url_params = queryString.parse(this.props.location.search);
		if (url_params["msg"]) {
			const { msg } = url_params;
			if (msg === "success") {
				this.setState({ header_subtitle: "Your account is now active, you can login now." });
			} else if (msg === "already_active") {
				this.setState({ header_subtitle: "Your account is already active, you can login." });
			} else if (msg === "token_expired") {
				this.setState({
					header_subtitle:
						"Sadly the URL you have entered has expired, to activate your profile you must reset your password and follow the instructions.",
				});
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.user_login_loading && nextProps.user_login_data.length !== 0) {
			if (nextProps.user_login_data.success) {
				localStorage.setItem("token", nextProps.user_login_data.token);
				localStorage.setItem("user", nextProps.user_login_data.user);
				this.props.history.push("/app/tasks");
			}
		}
		if (!nextProps.user_login_loading && nextProps.user_login_fail && nextProps.user_login_fail.length !== 0) {
			if (nextProps.user_login_fail.message) {
				toast.error(nextProps.user_login_fail.message);
			}
		}
	}

	render() {
		return (
			<div className={"register_main_container"}>
				<div className={"register_widget register_center"}>
					<div className={"register_header_container"}>
						<p className={"register_big_and_light_text"}>Login</p>
						<p>{this.state.header_subtitle}</p>
					</div>
					<Formik
						initialValues={{ identifier: "", password: "" }}
						onSubmit={(values, { setSubmitting }) => {
							this.props.login_user(values);
						}}
						validationSchema={Yup.object().shape({
							identifier: Yup.string("Invalid identifier.")
								.trim("No whitespace is allowed.")
								.required("Email or username is required."),
							password: Yup.string()
								.min(10, "Password minimal length is 10 characters.")
								.max(64, "Password maximal length is 64 characters.")
								.trim("No whitespace is allowed.")
								.required("Password is required."),
						})}
					>
						{(props) => {
							const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;
							return (
								<div>
									<Form onSubmit={handleSubmit} className={"login_form"}>
										<Form.Group>
											<Form.Label>Identifier</Form.Label>
											<Form.Control
												type="text"
												value={values.identifier}
												onChange={handleChange}
												onBlur={handleBlur}
												id="identifier"
												placeholder="Enter email or username"
												className={errors.identifier && touched.identifier ? "text-input error" : "text-input"}
											/>
											{errors.identifier && touched.identifier && <p className="input-feedback">{errors.identifier}</p>}
										</Form.Group>

										<Form.Group>
											<Form.Label>Password</Form.Label>
											<Form.Control
												type="password"
												value={values.password}
												onChange={handleChange}
												onBlur={handleBlur}
												id="password"
												placeholder="Enter password"
												className={errors.password && touched.password ? "text-input error" : "text-input"}
											/>
											{errors.password && touched.password && <p className="input-feedback">{errors.password}</p>}
										</Form.Group>

										<Form.Group>
											<Button type="submit" disabled={this.props.user_login_loading} style={{ width: "100%" }}>
												{this.props.user_login_loading ? "Please wait..." : "Login!"}
											</Button>
										</Form.Group>
									</Form>
								</div>
							);
						}}
					</Formik>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user_login_loading: state.user.user_login_loading,
		user_login_data: state.user.user_login_data,
		user_login_fail: state.user.user_login_fail,
	};
};

const mapDispatchToProps = {
	login_user,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Login);
