import React from "react";
import { connect } from "react-redux";
import { get_my_tasks, check_if_user_can_create_task, create_new_task } from "../actions/app_actions";
import "../css/Tasks.css";
import { Button, ButtonGroup, Modal, Form, Jumbotron } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import TagsInput from "./core/TagsInput";
import Picker from "./core/Picker";
import DatePicker from "./core/DatePicker";
import { toast } from "react-toastify";
import { momentify } from "../utils/helpers";

class Tasks extends React.Component {
	constructor(props) {
		super(props);
		const user = JSON.parse(localStorage.getItem("user"));
		this.state = {
			task_creator: {
				id: user._id,
				show_as: user.show_as,
			},
			sections: [
				{ name: "Today", id: "today" },
				{ name: "Tomorrow", id: "tomorrow" },
				{ name: "This week", id: "this_week" },
				{ name: "This month", id: "this_month" },
				{ name: "This year", id: "this_year" },
			],
			modal_for_task_creation_visible: false,
			task: {
				title: "",
				description: "",
				status: "",
				start_date: new Date(),
				end_date: null,
				planned_end_date: null,
				task_owner_user_id: null,
			},
		};
		this.task_members_tags = React.createRef();
		this.task_status_picker = React.createRef();
		this.task_owner_picker = React.createRef();
	}

	componentDidMount() {
		this.props.get_my_tasks();
	}

	componentWillReceiveProps(nextProps) {
		if (
			!nextProps.create_new_task_loading &&
			nextProps.create_new_task_fail.length === 0 &&
			nextProps.create_new_task_data.length !== 0 &&
			this.state.modal_for_task_creation_visible
		) {
			if (nextProps.create_new_task_data.success) {
				toast.success("Your task was successfully created.");
				this.handle_modal_for_task_creation_close();
				this.props.get_my_tasks();
			}
		}
	}

	render_sections() {
		return (
			<ButtonGroup vertical style={{ width: "100%", marginTop: "5px" }}>
				{this.state.sections.map((item, key) => {
					return (
						<Button key={key} style={{ backgroundColor: "#b1a296", border: 0 }}>
							{item.name}
						</Button>
					);
				})}
			</ButtonGroup>
		);
	}

	render_tasks(tasks) {
		if (tasks.length === 0) {
			return <p className={"tasks_title"}>Hmmm, looks like you don't have any tasks for now.</p>;
		}
		return tasks.map((task, key) => {
			return (
				<div key={key} className={"tasks_main_task_container"} onClick={() => this.props.history.push("/app/task/" + task._id.$oid)}>
					<Jumbotron fluid className={"tasks_jumbotron"}>
						<div className={"tasks_container"}>
							<div style={{ flex: 1 }}>
								<h1 className={"tasks_tasks_title"}>{task.title}</h1>
								<p>Created {momentify(task.created_at.$date).fromNow()}</p>
								<p>Description: {task.description}</p>
							</div>
							<div style={{ flex: 1 }}>
								<p>Created: {momentify(task.created_at.$date, true)}</p>
								<p>Author: {task.task_creator.show_as}</p>
								<p>Status: {task.task_status.status}</p>
								<p>Finished: {task.finished ? "Yes" : "No"}</p>
								<p>
									PED: {momentify(task.planned_end_date.$date, true)} ({momentify(task.planned_end_date.$date).fromNow()})
								</p>
							</div>
						</div>
					</Jumbotron>
				</div>
			);
		});
	}

	handle_modal_for_task_creation_close() {
		this.setState({ modal_for_task_creation_visible: false });
	}

	handle_modal_for_task_creation_open() {
		// first check if user has any projects
		this.props.check_if_user_can_create_task((data) => {
			if (data) {
				this.setState({ modal_for_task_creation_visible: true });
			}
		});
	}

	handle_task_create_from_modal() {
		this.handle_modal_for_task_creation_close();
	}

	render() {
		return (
			<div className={"tasks_main_container"} style={{ display: "flex", flexDirection: "row" }}>
				<div className={"tasks_left_side"} style={{ flex: 1.5 }}>
					<div>
						<p>See tasks for:</p>
						<div>{this.render_sections()}</div>
					</div>
					<div style={{ marginTop: 10 }}>
						<p>Something to do?</p>
						<div>
							<Button
								style={{ background: "#7395ae", border: 0, width: "100%", marginTop: "5px" }}
								className={"something_to_do_button"}
								onClick={() => this.handle_modal_for_task_creation_open()}
							>
								Create a new task
							</Button>
						</div>
					</div>
					<div style={{ marginTop: 10 }}>
						<p>Finished a lot of tasks today?</p>
						<div>
							<Button style={{ background: "#938e94", border: 0, width: "100%", marginTop: "5px" }}>Archive tasks</Button>
						</div>
					</div>
				</div>
				<div className={"tasks_right_side"} style={{ flex: 8 }}>
					{this.props.my_tasks_loading ? (
						<p className={"tasks_title"}>We are fetching your tasks, please wait...</p>
					) : (
						this.render_tasks(this.props.my_tasks_data)
					)}
				</div>

				<Modal
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
					show={this.state.modal_for_task_creation_visible}
					onHide={() => this.handle_modal_for_task_creation_close()}
					style={{ color: "#5d5c61" }}
				>
					<Modal.Header closeButton>
						<Modal.Title>Create a new task</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Formik
							initialValues={{
								title: "",
								description: "",
								task_members: [this.state.task_creator],
								planned_end_date: new Date(),
							}}
							onSubmit={(values, { setSubmitting }) => {
								this.props.create_new_task(values);
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
								task_members: Yup.array().of(
									Yup.object().shape({
										id: Yup.string("Invalid id provided.").required("No id provided."),
										show_as: Yup.string("Invalid text provided.").required("No text provided."),
									}),
								),
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
							})}
						>
							{(props) => {
								const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = props;
								return (
									<div>
										<Form autoComplete={"off"} onSubmit={handleSubmit} className={"login_form"}>
											<Form.Group>
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

											<Form.Group>
												<Form.Label>Description</Form.Label>
												<Form.Control
													type="text"
													as="textarea"
													value={values.description}
													onChange={handleChange}
													onBlur={handleBlur}
													id="description"
													placeholder="Enter description"
													className={errors.description && touched.description ? "text-input error" : "text-input"}
												/>
												{errors.description && touched.description && <p className="input-feedback">{errors.description}</p>}
											</Form.Group>

											<Form.Group>
												<Form.Label>Project</Form.Label>
												<Picker
													data={this.props.my_projects_data}
													on_select={(data) => {
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
															this.task_members_tags.current.setState({
																suggestions: [],
																suggestions_url: null,
																suggestions_params: null,
															});
															setFieldValue("project", { id: null, show_as: null });
														}
													}}
													show_property={"title"}
													key_property={"_id"}
												/>
												{errors.project && touched.project && <p className="input-feedback">{errors.project}</p>}
											</Form.Group>

											<Form.Group>
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
													request_url={null}
													request_params={null}
													show_property={"show_as"}
													key_property={"_id"}
												/>
												{errors.task_owner && touched.task_owner && <p className="input-feedback">{errors.task_owner}</p>}
											</Form.Group>

											<Form.Group>
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
													request_url={null}
													request_params={null}
													show_property={"status"}
													key_property={"_id"}
												/>
												{errors.task_status && touched.task_status && <p className="input-feedback">{errors.task_status}</p>}
											</Form.Group>

											<Form.Group>
												<Form.Label>Task members</Form.Label>
												<TagsInput
													random_tags_allowed={false}
													ref={this.task_members_tags}
													protected_tag={this.state.task_creator}
													onChange={(tags) => setFieldValue("task_members", tags)}
													tags={values.task_members}
													suggestions_url={null}
													suggestions_params={null}
													label_field={"show_as"}
												/>
												{errors.task_members && touched.task_members && <p className="input-feedback">{errors.task_members}</p>}
											</Form.Group>

											<Form.Group>
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

											<Form.Group>
												<Button type="submit" disabled={this.props.create_task_loading} style={{ width: "100%" }}>
													{this.props.create_task_loading ? "Please wait..." : "Create task!"}
												</Button>
											</Form.Group>
										</Form>
									</div>
								);
							}}
						</Formik>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		my_tasks_loading: state.app.my_tasks_loading,
		my_tasks_data: state.app.my_tasks_data,
		my_tasks_fail: state.app.my_tasks_fail,
		create_task_loading: state.app.create_task_loading,
		create_task_data: state.app.create_task_data,
		create_task_fail: state.app.create_task_fail,
		my_projects_data: state.app.my_projects_data,
		create_new_task_loading: state.app.create_new_task_loading,
		create_new_task_data: state.app.create_new_task_data,
		create_new_task_fail: state.app.create_new_task_fail,
	};
};

const mapDispatchToProps = {
	get_my_tasks,
	check_if_user_can_create_task,
	create_new_task,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Tasks);
