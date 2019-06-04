import React from "react";
import { connect } from "react-redux";
import { get_task_details, update_task } from "../actions/app_actions";
import "../css/TaskDetailedView.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import TagsInput from "./core/TagsInput";
import DatePicker from "./core/DatePicker";
import Picker from "./core/Picker";
import { toast } from "react-toastify";

class TaskDetailedView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			task: [],
		};
		this.task_members_tags = React.createRef();
		this.task_status_picker = React.createRef();
		this.task_owner_picker = React.createRef();
	}

	componentDidMount() {
		this.props.get_task_details(this.props.match.params.task_id);
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.get_task_details_loading && nextProps.get_task_details_fail.length === 0 && nextProps.get_task_details_data.length !== 0) {
			this.setState({ task: nextProps.get_task_details_data });
		}

		if (!nextProps.update_task_loading && nextProps.update_task_data.length !== 0) {
			if (nextProps.update_task_data.success) {
				if (nextProps.update_task_data.message) {
					toast.success(nextProps.update_task_data.message);
				}
				this.props.history.push("/app/tasks");
			}
		}
		if (!nextProps.update_task_loading && nextProps.update_task_fail && nextProps.update_task_fail.length !== 0) {
			if (nextProps.update_task_fail.message) {
				toast.error(nextProps.update_task_fail.message);
			}
		}
	}

	render() {
		if (this.props.get_task_details_loading || this.state.task.length === 0) {
			return (
				<div style={{ padding: 5 }}>
					<p className={"tdv_title"}>We are fetching task details, please wait...</p>
				</div>
			);
		}

		const { task } = this.state;

		return (
			<div style={{ background: "#3b4d74", paddingBottom: 30 }}>
				<div className={"tdv_section_container"}>
					<Formik
						initialValues={{
							title: task.title,
							description: task.description,
							task_status: { id: task.task_status._id.$oid, status_id: task.task_status.status_id, status: task.task_status.status },
							start_date: task.start_date ? new Date(task.start_date.$date) : new Date(),
							end_date: task.end_date ? new Date(task.end_date.$date) : new Date(),
							planned_end_date: task.planned_end_date ? new Date(task.planned_end_date.$date) : new Date(),
							task_owner: { id: task.task_owner._id.$oid, show_as: task.task_owner.show_as },
							task_members: [{ id: task.task_creator._id.$oid, show_as: task.task_creator.show_as }],
							project: { id: task.project._id.$oid, show_as: task.project.title },
						}}
						onSubmit={(values, { setSubmitting }) => {
							this.props.update_task(task._id.$oid, values);
						}}
						validationSchema={Yup.object().shape({
							title: Yup.string("Invalid title.")
								.trim("No whitespace is allowed.")
								.min(4, "Minimal length for the task title is 4 characters.")
								.required("Task title is required."),
							description: Yup.string("Invalid description.")
								.trim("No whitespace is allowed.")
								.min(4, "Minimal length for the task description is 4 characters.")
								.required("Task description is required."),
							task_owner: Yup.object().shape({
								id: Yup.string("Invalid id provided.").required("No id provided."),
								show_as: Yup.string("Invalid show_as provided.").required("No show_as provided."),
							}),
							project: Yup.object().shape({
								id: Yup.string("Invalid id provided.").required("No id provided."),
								show_as: Yup.string("Invalid show_as provided.").required("No show_as provided."),
							}),
							task_status: Yup.object().shape({
								id: Yup.string("Invalid id provided.").required("No id provided."),
								status_id: Yup.string("Invalid status_id provided.").required("No status_id provided."),
								status: Yup.string("Invalid status provided.").required("No status provided."),
							}),
							planned_end_date: Yup.date().min(new Date(), "Selected date is invalid!"),
							start_date: Yup.date("Date is invalid!").required("Date is invalid"),
							end_date: Yup.date("Date is invalid!").required("Date is invalid"),
							task_members: Yup.array().of(
								Yup.object().shape({
									id: Yup.string("Invalid id provided.").required("No id provided."),
									show_as: Yup.string("Invalid text provided.").required("No text provided."),
								}),
							),
						})}
					>
						{(props) => {
							const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
							return (
								<div>
									<Form autoComplete={"off"} onSubmit={handleSubmit} className={"tdv_edit_task_form"}>
										<p className={"tdv_section_title"}>Basic</p>
										<div className={"tdv_subsection_container"}>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Title</Form.Label>
												<Form.Control
													type="text"
													value={values.title}
													onChange={handleChange}
													onBlur={handleBlur}
													id="title"
													placeholder="Enter title"
													className={errors.title && touched.title ? "text-input error" : "text-input"}
												/>
												{errors.title && touched.title && <p className="input-feedback">{errors.title}</p>}
											</Form.Group>

											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Description</Form.Label>
												<Form.Control
													type="text"
													as="textarea"
													rows="1"
													value={values.description}
													onChange={handleChange}
													onBlur={handleBlur}
													id="description"
													placeholder="Enter description"
													className={errors.description && touched.description ? "text-input error" : "text-input"}
												/>
												{errors.description && touched.description && <p className="input-feedback">{errors.description}</p>}
											</Form.Group>

											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Task status</Form.Label>
												<Picker
													ref={this.task_status_picker}
													on_select={(data) => {
														if (data) {
															setFieldValue("task_status", { id: data._id.$oid, status_id: data.status_id, status: data.status });
														} else {
															setFieldValue("task_status", { id: null, status_id: null, status: null });
														}
													}}
													selected_item={values.task_status}
													request_url={"/api/projects/get_available_task_statuses_for_project"}
													request_params={{ project_id: task.project._id.$oid }}
													show_property={"status"}
													key_property={"_id"}
												/>
												{errors.task_status && touched.task_status && (
													<p className="input-feedback">{errors.task_status ? "Invalid task status" : null}</p>
												)}
											</Form.Group>
										</div>
										<p className={"tdv_section_title"}>Dates</p>
										<div className={"tdv_subsection_container"}>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Start date</Form.Label>
												<br />
												<DatePicker
													show_time_select={true}
													selected_date={values.start_date}
													read_only={true}
													show_year_dropdown={true}
													on_change={(date) => {
														setFieldValue("start_date", date);
													}}
												/>
												{errors.start_date && touched.start_date && <p className="input-feedback">{errors.start_date}</p>}
											</Form.Group>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>End date</Form.Label>
												<br />
												<DatePicker
													show_time_select={true}
													selected_date={values.end_date}
													show_year_dropdown={true}
													on_change={(date) => {
														setFieldValue("end_date", date);
													}}
												/>
												{errors.end_date && touched.end_date && <p className="input-feedback">{errors.end_date}</p>}
											</Form.Group>

											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Planned end date</Form.Label>
												<br />
												<DatePicker
													show_time_select={true}
													selected_date={values.planned_end_date}
													show_year_dropdown={true}
													on_change={(date) => {
														setFieldValue("planned_end_date", date);
													}}
												/>
												{errors.planned_end_date && touched.planned_end_date && (
													<p className="input-feedback">{errors.planned_end_date}</p>
												)}
											</Form.Group>
										</div>
										<p className={"tdv_section_title"}>Project and members</p>
										<div className={"tdv_subsection_container"}>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Project</Form.Label>
												<Picker
													data={this.props.my_projects_data}
													on_select={(data) => {
														/**
														 * first clear pickers TaskStatus, TaskMembers and TaskOwner
														 */
														this.task_status_picker.current.setState({
															request_params: null,
															request_url: null,
															selected_item: null,
															data: [],
														});
														setFieldValue("task_status", { id: null, status_id: null, status: null });
														this.task_members_tags.current.setState({
															tags: [],
															suggestions: [],
															suggestions_url: null,
															suggestions_params: null,
															protected_tag: null,
														});
														setFieldValue("task_members", [null]);
														this.task_owner_picker.current.setState({
															request_params: null,
															request_url: null,
															selected_item: null,
															data: [],
														});
														setFieldValue("task_owner", { id: null, show_as: null });

														if (data) {
															this.task_status_picker.current.setState(
																{
																	request_url: "/api/projects/get_available_task_statuses_for_project",
																	request_params: { project_id: data._id.$oid },
																},
																() => {
																	this.task_status_picker.current.get_data();
																},
															);
															this.task_owner_picker.current.setState(
																{
																	request_url: "/api/projects/get_project_members",
																	request_params: { project_id: data._id.$oid },
																},
																() => {
																	this.task_owner_picker.current.get_data();
																},
															);
															this.task_members_tags.current.setState(
																{
																	suggestions_url: "/api/projects/get_project_members",
																	suggestions_params: { project_id: data._id.$oid },
																},
																() => {
																	this.task_members_tags.current.get_data();
																},
															);
															setFieldValue("project", { id: data._id.$oid, show_as: data.title });
														} else {
															setFieldValue("project", { id: null, show_as: null });
														}
													}}
													selected_item={task.project}
													request_url={"/api/projects/get_my_projects"}
													show_property={"title"}
													key_property={"_id"}
												/>
												{errors.project && touched.project && (
													<p className="input-feedback">{errors.project ? "Invalid project" : null}</p>
												)}
											</Form.Group>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Task owner</Form.Label>
												<Picker
													ref={this.task_owner_picker}
													on_select={(data) => {
														if (data) {
															setFieldValue("task_owner", { id: data._id.$oid, show_as: data.show_as });
														} else {
															setFieldValue("task_owner", { id: null, show_as: null });
														}
													}}
													selected_item={task.task_owner}
													request_url={null}
													request_params={null}
													show_property={"show_as"}
													key_property={"_id"}
												/>
												{errors.task_owner && touched.task_owner && (
													<p className="input-feedback">{errors.task_owner ? "Invalid task owner" : null}</p>
												)}
											</Form.Group>
										</div>
										<Form.Group style={{ flex: 1 }}>
											<Form.Label>Task members</Form.Label>
											<TagsInput
												random_tags_allowed={false}
												ref={this.task_members_tags}
												protected_tag={this.state.task_creator}
												onChange={(tags) => setFieldValue("task_members", tags)}
												tags={values.task_members}
												suggestions_url={"/api/projects/get_project_members"}
												suggestions_params={{ project_id: task.project_id.$oid }}
												label_field={"show_as"}
											/>
											{errors.task_members && touched.task_members && (
												<p className="input-feedback">{errors.task_members ? "Invalid task members" : null}</p>
											)}
										</Form.Group>

										<Form.Group>
											<Button
												type="submit"
												disabled={this.props.user_login_loading}
												style={{ width: "100%", background: "#ffcb88", marginTop: 30, color: "#5D5C61" }}
											>
												{this.props.user_login_loading ? "Please wait..." : "Save!"}
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
		get_task_details_loading: state.app.get_task_details_loading,
		get_task_details_data: state.app.get_task_details_data,
		get_task_details_fail: state.app.get_task_details_fail,
		my_projects_data: state.app.my_projects_data,
		update_task_loading: state.app.update_task_loading,
		update_task_data: state.app.update_task_data,
		update_task_fail: state.app.update_task_fail,
	};
};

const mapDispatchToProps = {
	get_task_details,
	update_task,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TaskDetailedView);
