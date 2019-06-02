import React from "react";
import "../css/Register.css";
import { Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/datepicker.css";
import { register_new_user } from "../actions/user_actions";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class Register extends React.Component {
	componentWillReceiveProps(nextProps) {
		if (!nextProps.user_registration_loading && nextProps.user_registration_data.length !== 0) {
			if (nextProps.user_registration_data.message) {
				toast.success(nextProps.user_registration_data.message);
			}
		}
		if (!nextProps.user_registration_loading && nextProps.user_registration_fail.length !== 0) {
			if (nextProps.user_registration_fail.message) {
				toast.error(nextProps.user_registration_fail.message);
			}
		}
	}

	render() {
		return (
			<div className={"register_main_container"}>
				<div className={"register_widget register_center"}>
					<div className={"register_header_container"}>
						<p className={"register_big_and_light_text"}>Welcome</p>
						<p>Please fill in the form below</p>
					</div>
					<Formik
						initialValues={{ email: "", username: "", password: "", password_repeat: "", first_name: "", last_name: "", date_of_birth: new Date() }}
						onSubmit={(values, { setSubmitting }) => {
							this.props.register_new_user(values);
						}}
						validationSchema={Yup.object().shape({
							email: Yup.string()
								.email("Invalid email address.")
								.required("Email is required."),
							username: Yup.string()
								.min(8, "Username minimal length is 8 characters.")
								.max(64, "USername maximal length is 64 characters.")
								.trim()
								.required("Username is required."),
							password: Yup.string()
								.min(10, "Password minimal length is 10 characters.")
								.max(64, "Password maximal length is 64 characters.")
								.trim()
								.required("Password is required."),
							password_repeat: Yup.string()
								.oneOf([Yup.ref("password"), null], "Passwords do not match!")
								.required("Password repeat is required."),
							first_name: Yup.string()
								.required("First name is requried.")
								.min(3, "First name minimal length is 3 characters."),
							last_name: Yup.string()
								.required("Last name is requried")
								.min(3, "Last name minimal length is required"),
							date_of_birth: Yup.date(),
						})}
					>
						{(props) => {
							const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
							return (
								<div>
									<Form onSubmit={handleSubmit} className={"register_form"}>
										<div className={"form_div"}>
											<Form.Group>
												<Form.Label>Email address</Form.Label>
												<Form.Control
													type="text"
													value={values.email}
													onChange={handleChange}
													onBlur={handleBlur}
													id="email"
													placeholder="Enter email"
													className={errors.email && touched.email ? "text-input error" : "text-input"}
												/>
												{errors.email && touched.email && <p className="input-feedback">{errors.email}</p>}
											</Form.Group>

											<Form.Group>
												<Form.Label>Username</Form.Label>
												<Form.Control
													type="text"
													value={values.username}
													onChange={handleChange}
													onBlur={handleBlur}
													id="username"
													placeholder="Enter username"
													className={errors.email && touched.email ? "text-input error" : "text-input"}
												/>
												{errors.username && touched.username && <p className="input-feedback">{errors.username}</p>}
											</Form.Group>

											<Form.Group>
												<Form.Label>Maybe some other time</Form.Label>
												<br />
												<Button
													variant="secondary"
													disabled={this.props.user_registration_loading}
													onClick={() => this.props.history.goBack()}
													style={{ width: "100%" }}
												>
													Go back
												</Button>
											</Form.Group>
										</div>
										<div className={"form_div"}>
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
												<Form.Label>Password repeat</Form.Label>
												<Form.Control
													type="password"
													value={values.password_repeat}
													onChange={handleChange}
													onBlur={handleBlur}
													id="password_repeat"
													placeholder="Repeat password"
													className={errors.password_repeat && touched.password_repeat ? "text-input error" : "text-input"}
												/>
												{errors.password_repeat && touched.password_repeat && (
													<p className="input-feedback">{errors.password_repeat}</p>
												)}
											</Form.Group>

											<Form.Group>
												<Form.Label>End this nonsense!</Form.Label>
												<br />
												<Button type="submit" disabled={this.props.user_registration_loading} style={{ width: "100%" }}>
													{this.props.user_registration_loading ? "Please wait..." : "Register!"}
												</Button>
											</Form.Group>
										</div>
										<div className={"form_div"}>
											<Form.Group>
												<Form.Label>First name</Form.Label>
												<Form.Control
													type="text"
													value={values.first_name}
													onChange={handleChange}
													onBlur={handleBlur}
													id="first_name"
													placeholder="Your first name"
													className={errors.first_name && touched.first_name ? "text-input error" : "text-input"}
												/>
												{errors.first_name && touched.first_name && <p className="input-feedback">{errors.first_name}</p>}
											</Form.Group>

											<Form.Group>
												<Form.Label>Last name</Form.Label>
												<Form.Control
													type="text"
													value={values.last_name}
													onChange={handleChange}
													onBlur={handleBlur}
													id="last_name"
													placeholder="Your last name"
													className={errors.last_name && touched.last_name ? "text-input error" : "text-input"}
												/>
												{errors.last_name && touched.last_name && <p className="input-feedback">{errors.last_name}</p>}
											</Form.Group>

											<Form.Group>
												<Form.Label>Date of birth</Form.Label>
												<br />

												<DatePicker
													id="date_of_birth"
													name="date_of_birth"
													showYearDropdown
													yearDropdownItemNumber={5}
													selected={values.date_of_birth}
													onChange={(date) => setFieldValue("date_of_birth", date)}
													className={
														errors.date_of_birth && touched.date_of_birth
															? "text-input error form-control"
															: "text-input form-control"
													}
												/>
												{errors.date_of_birth && touched.date_of_birth && <p className="input-feedback">{errors.date_of_birth}</p>}
											</Form.Group>
										</div>
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
		user_registration_loading: state.user.user_registration_loading,
		user_registration_data: state.user.user_registration_data,
		user_registration_fail: state.user.user_registration_fail,
	};
};

const mapDispatchToProps = {
	register_new_user,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Register);
