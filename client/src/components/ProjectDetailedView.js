import React from "react";
import { connect } from "react-redux";
import { get_project_details, update_project } from "../actions/app_actions";
import "../css/ProjectDetailedView.css";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import TagsInput from "./core/TagsInput";
import Picker from "./core/Picker";
import { momentify } from "../utils/helpers";
import { toast } from "react-toastify";

class ProjectDetailedView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			project: [],
		};
		this.task_members_tags = React.createRef();
		this.task_status_picker = React.createRef();
		this.task_owner_picker = React.createRef();
	}

	componentDidMount() {
		this.props.get_project_details(this.props.match.params.project_id);
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.project_details_loading && nextProps.project_details_fail.length === 0 && nextProps.project_details_data.length !== 0) {
			this.setState({ project: nextProps.project_details_data });
		}

		if (!nextProps.update_project_loading && nextProps.update_project_data.length !== 0) {
			if (nextProps.update_project_data.success) {
				if (nextProps.update_project_data.message) {
					toast.success(nextProps.update_project_data.message);
				}
				this.props.history.push("/app/projects");
			}
		}
		if (!nextProps.update_project_loading && nextProps.update_project_fail && nextProps.update_project_fail.length !== 0) {
			if (nextProps.update_project_fail.message) {
				toast.error(nextProps.update_project_fail.message);
			}
		}
	}

	refabricate(my_array = []) {
		let data = [];
		for (var i = 0, len = my_array.length; i < len; i++) {
			data.push(my_array[i]);
			if ("_id" in data[i]) {
				data[i].id = data[i]._id.$oid;
			}
		}
		return data;
	}

	render_tasks(tasks = []) {
		return tasks.map((task, key) => {
			return (
				<div className={"pdv_task_container"} key={key} onClick={() => this.props.history.push("/app/task/" + task._id.$oid)}>
					<p>
						{task.title}, created by {task.task_creator.show_as} on {momentify(task.created_at.$date, true)}
					</p>
					<p>Description: {task.description}</p>
					<p>Status: {task.task_status.status}</p>
					<p>Owner: {task.task_owner.show_as}</p>
				</div>
			);
		});
	}

	render() {
		if (this.props.get_project_details_loading || this.state.project.length === 0) {
			return (
				<div style={{ padding: 5 }}>
					<p className={"pdv_title"}>We are fetching your project details, please wait...</p>
				</div>
			);
		}

		const { project } = this.state;

		let project_members = this.refabricate(project.project_members);
		let project_statuses = this.refabricate(project.project_statuses);
		let project_task_statuses = this.refabricate(project.project_task_statuses);

		return (
			<div style={{ background: "#3b4d74", paddingBottom: 30 }}>
				<div className={"pdv_section_container"}>
					<Formik
						initialValues={{
							title: project.title,
							description: project.description,
							project_creator: { id: project.project_creator._id.$oid, show_as: project.project_creator.show_as },
							project_leader: { id: project.project_leader._id.$oid, show_as: project.project_leader.show_as },
							project_members: project_members,
							project_statuses: project_statuses,
							project_task_statuses: project_task_statuses,
						}}
						onSubmit={(values, { setSubmitting }) => {
							this.props.update_project(project._id.$oid, values);
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
							project_creator: Yup.object().shape({
								id: Yup.string("Invalid id provided.").required("No id provided."),
								show_as: Yup.string("Invalid show_as provided.").required("No show_as provided."),
							}),
							project_leader: Yup.object().shape({
								id: Yup.string("Invalid id provided.").required("No id provided."),
								show_as: Yup.string("Invalid show_as provided.").required("No show_as provided."),
							}),
							project_members: Yup.array().of(
								Yup.object().shape({
									id: Yup.string("Invalid id provided.").required("No id provided."),
									show_as: Yup.string("Invalid text provided.").required("No text provided."),
								}),
							),
							project_task_statuses: Yup.array()
								.of(
									Yup.object().shape({
										id: Yup.string("Invalid id provided.").required("No id provided."),
										status: Yup.string("Invalid status provided.").required("No status provided."),
									}),
								)
								.required("Project task statuses are required."),
							project_statuses: Yup.array()
								.of(
									Yup.object().shape({
										id: Yup.string("Invalid id provided.").required("No id provided."),
										status: Yup.string("Invalid status provided.").required("No status provided."),
									}),
								)
								.required("Project statuses are required."),
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
										</div>

										<p className={"tdv_section_title"}>People</p>
										<div className={"tdv_subsection_container"}>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Project creator</Form.Label>
												<Form.Control
													type="text"
													disabled={true}
													value={values.project_creator.show_as}
													onChange={handleChange}
													onBlur={handleBlur}
													id="project_creator"
													placeholder="Enter project creator"
													className={errors.project_creator && touched.project_creator ? "text-input error" : "text-input"}
												/>
												{errors.project_creator && touched.project_creator && (
													<p className="input-feedback">{errors.project_creator}</p>
												)}
											</Form.Group>

											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Project leader</Form.Label>
												<Picker
													ref={this.project_leader_picker}
													on_select={(data) => {
														if (data) {
															setFieldValue("project_leader", { id: data._id.$oid, show_as: data.show_as });
														} else {
															setFieldValue("project_leader", { id: null, show_as: null });
														}
													}}
													data={project.project_members}
													selected_item={project.project_leader}
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
											<Form.Label>Project members</Form.Label>
											<TagsInput
												random_tags_allowed={false}
												ref={this.project_members_tags}
												protected_tag={values.project_owner}
												onChange={(tags) => setFieldValue("project_members", tags)}
												tags={values.project_members}
												suggestions_url={"/api/users/get_all_users"}
												suggestions_params={null}
												label_field={"show_as"}
											/>
											{errors.project_members && touched.project_members && (
												<p className="input-feedback">{errors.project_members ? "Invalid project members" : null}</p>
											)}
										</Form.Group>

										<p className={"tdv_section_title"}>Statuses</p>
										<div className={"tdv_subsection_container"}>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Project statuses</Form.Label>
												<TagsInput
													random_tags_allowed={true}
													ref={this.project_statuses_tags}
													onChange={(tags) => setFieldValue("project_statuses", tags)}
													tags={values.project_statuses}
													suggestions_url={null}
													suggestions_params={null}
													label_field={"status"}
												/>
												{errors.project_statuses && touched.project_statuses && (
													<p className="input-feedback">{errors.project_statuses ? "Invalid project statuses" : null}</p>
												)}
											</Form.Group>
											<Form.Group style={{ flex: 1 }}>
												<Form.Label>Task statuses</Form.Label>
												<TagsInput
													random_tags_allowed={true}
													ref={this.project_task_statuses_tags}
													onChange={(tags) => setFieldValue("project_task_statuses", tags)}
													tags={values.project_task_statuses}
													suggestions_url={null}
													suggestions_params={null}
													label_field={"status"}
												/>
												{errors.project_task_statuses && touched.project_task_statuses && (
													<p className="input-feedback">{errors.project_task_statuses ? "Invalid project task statuses" : null}</p>
												)}
											</Form.Group>
										</div>

										<p className={"tdv_section_title"}>Tasks</p>
										<div style={{ marginTop: 5 }}>{this.render_tasks(project.project_tasks)}</div>

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
		project_details_loading: state.app.project_details_loading,
		project_details_data: state.app.project_details_data,
		project_details_fail: state.app.project_details_fail,
		update_project_loading: state.app.update_project_loading,
		update_project_data: state.app.update_project_data,
		update_project_fail: state.app.update_project_fail,
	};
};

const mapDispatchToProps = { get_project_details, update_project };

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProjectDetailedView);
