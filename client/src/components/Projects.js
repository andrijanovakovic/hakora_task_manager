import React from "react";
import "../css/Projects.css";
import { connect } from "react-redux";
import { fetch_my_projects, create_new_project } from "../actions/app_actions";
import { Card } from "react-bootstrap";
import { Button, Modal, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import TagsInput from "./core/TagsInput";
import Picker from "./core/Picker";
import { toast } from "react-toastify";
import { truncate_string } from "../utils/helpers";

class Projects extends React.Component {
	constructor(props) {
		super(props);
		const user = JSON.parse(localStorage.getItem("user"));
		this.state = {
			user,
			project_modal_visible: false,
			project_creator: {
				id: user._id,
				show_as: user.show_as,
			},
			project_members: [
				{
					id: user._id,
					show_as: user.show_as,
				},
			],
		};
	}

	componentDidMount() {
		this.props.fetch_my_projects();
	}

	componentWillReceiveProps(nextProps) {
		/**
		 * if create new project is finished loading
		 * and there are no errors
		 * and server responded with success
		 */
		if (
			!nextProps.create_new_project_loading &&
			nextProps.create_new_project_fail.length === 0 &&
			nextProps.create_new_project_data.length !== 0 &&
			nextProps.create_new_project_data === true &&
			this.state.project_modal_visible
		) {
			toast.success("Your project was successfully created.");
			this.close_project_modal();
			this.props.fetch_my_projects();
		}
	}

	render_projects() {
		if (this.props.my_projects_loading) {
			return <p className={"projects_title"}>We are fetching your projects, please wait...</p>;
		}
		return this.props.my_projects_data.map((item, key) => {
			return (
				<Card
					key={key}
					className={"projects_project_card"}
					style={{ width: "19rem", color: "#5d5c61", height: "15rem" }}
					onClick={() => this.props.history.push("/app/project/" + item._id.$oid)}
				>
					<Card.Body>
						<Card.Title>{truncate_string(item.title, 20)}</Card.Title>
						<Card.Subtitle>{truncate_string(item.description, 64)}</Card.Subtitle>
						<br />
						<Card.Text>
							{item.project_leader._id.$oid === this.state.user._id
								? `You are the leader of this project`
								: `Project leader is ${item.project_leader.show_as}`}
							, it has {item.project_members.length > 1 ? `${item.project_members.length} members` : `${item.project_members.length} member`} and{" "}
							{item.tasks.length > 1 || item.tasks.length === 0 ? `${item.tasks.length} tasks.` : `${item.tasks.length} task.`}
						</Card.Text>
					</Card.Body>
				</Card>
			);
		});
	}

	open_project_modal() {
		this.setState({ project_modal_visible: true });
	}

	close_project_modal() {
		this.setState({ project_modal_visible: false });
	}

	render() {
		return (
			<div className={"projects_main_container"}>
				<Card
					className={"projects_add_project_card"}
					style={{ width: "19rem", color: "#ffcb88", height: "15rem" }}
					onClick={() => this.open_project_modal()}
				>
					<Card.Body>
						<Card.Title>Create a new project</Card.Title>
						<Card.Subtitle>Click anywhere on this card to create a new project.</Card.Subtitle>
						<br />
						<Card.Text>Project name should be intuitive. You can add description, members, statuses and more!</Card.Text>
						<br />
					</Card.Body>
				</Card>
				<Modal
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
					show={this.state.project_modal_visible}
					onHide={() => this.close_project_modal()}
					style={{ color: "#5d5c61" }}
				>
					<Modal.Header closeButton>
						<Modal.Title>Create a new project</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Formik
							initialValues={{
								title: "",
								description: "",
								project_creator: this.state.project_creator,
								project_statuses: [
									{ id: "in_progress", text: "In progress" },
									{ id: "development", text: "Development" },
									{ id: "stand_by", text: "Stand-by" },
								],
								project_task_statuses: [
									{ id: "started", text: "Started" },
									{ id: "in_progress", text: "In progress" },
									{ id: "finished", text: "Finished" },
								],
								project_members: this.state.project_members,
							}}
							onSubmit={(values, { setSubmitting }) => {
								this.props.create_new_project(values);
							}}
							validationSchema={Yup.object().shape({
								title: Yup.string("Invalid title.")
									.trim("No whitespace is allowed.")
									.min(4, "Minimal length for the project title is 4 characters.")
									.required("Project title is required."),
								description: Yup.string("Invalid description.")
									.trim("No whitespace is allowed.")
									.min(4, "Minimal length for the project description is 4 characters.")
									.required("Project description is required."),
								project_task_statuses: Yup.array()
									.of(
										Yup.object().shape({
											id: Yup.string("Invalid id provided.").required("No id provided."),
											text: Yup.string("Invalid text provided.").required("No text provided."),
										}),
									)
									.required("Project task statuses are required."),
								project_statuses: Yup.array()
									.of(
										Yup.object().shape({
											id: Yup.string("Invalid id provided.").required("No id provided."),
											text: Yup.string("Invalid text provided.").required("No text provided."),
										}),
									)
									.required("Project statuses are required."),
								project_members: Yup.array().of(
									Yup.object().shape({
										id: Yup.string("Invalid id provided.").required("No id provided."),
										show_as: Yup.string("Invalid text provided.").required("No text provided."),
									}),
								),
								project_creator: Yup.object()
									.shape({
										id: Yup.string("Invalid id provided.").required("No id provided."),
										show_as: Yup.string("Invalid show_as provided.").required("No show_as provided."),
									})
									.required("Project creator is required."),
								project_leader: Yup.object().shape({
									id: Yup.string("Invalid id provided.").required("No id provided."),
									show_as: Yup.string("Invalid show_as provided.").required("No show_as provided."),
								}),
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
													placeholder="Enter task title"
													className={errors.title && touched.title ? "text-input error" : "text-input"}
												/>
												{errors.title && touched.title && <p className="input-feedback">{errors.title}</p>}
											</Form.Group>

											<Form.Group>
												<Form.Label>Description</Form.Label>
												<Form.Control
													type="type"
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
												<Form.Label>Available statuses for the project</Form.Label>
												<TagsInput onChange={(tags) => setFieldValue("project_statuses", tags)} tags={values.project_statuses} />
												{errors.project_statuses && touched.project_statuses && (
													<p className="input-feedback">{errors.project_statuses}</p>
												)}
											</Form.Group>

											<Form.Group>
												<Form.Label>Available statuses for the project's tasks</Form.Label>
												<TagsInput
													onChange={(tags) => setFieldValue("project_task_statuses", tags)}
													tags={values.project_task_statuses}
												/>
												{errors.project_task_statuses && touched.project_task_statuses && (
													<p className="input-feedback">{errors.project_task_statuses}</p>
												)}
											</Form.Group>

											<Form.Group>
												<Form.Label>Project creator</Form.Label>
												<Form.Control
													disabled
													type="text"
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

											<Form.Group>
												<Form.Label>Project leader</Form.Label>
												<Picker
													on_select={(data) => {
														setFieldValue("project_leader", { id: data._id.$oid, show_as: data.show_as });
													}}
													request_url={"/api/users/get_all_users"}
													request_params={null}
													show_property={"show_as"}
													key_property={"_id"}
												/>
												{errors.project_creator && touched.project_creator && (
													<p className="input-feedback">{errors.project_creator}</p>
												)}
											</Form.Group>

											<Form.Group>
												<Form.Label>Project members</Form.Label>
												<TagsInput
													random_tag_allowed={false}
													protected_tag={this.state.project_creator}
													onChange={(tags) => setFieldValue("project_members", tags)}
													tags={values.project_members}
													suggestions_url={"/api/users/get_all_users"}
													suggestions_params={null}
													label_field={"show_as"}
												/>
												{errors.project_members && touched.project_members && (
													<p className="input-feedback">{errors.project_members}</p>
												)}
											</Form.Group>

											<Form.Group>
												<Button type="submit" disabled={this.props.create_task_loading} style={{ width: "100%" }}>
													{this.props.create_task_loading ? "Please wait..." : "Create project!"}
												</Button>
											</Form.Group>
										</Form>
									</div>
								);
							}}
						</Formik>
					</Modal.Body>
				</Modal>
				{this.render_projects()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		my_projects_loading: state.app.my_projects_loading,
		my_projects_data: state.app.my_projects_data,
		my_projects_fail: state.app.my_projects_fail,
		create_new_project_loading: state.app.create_new_project_loading,
		create_new_project_data: state.app.create_new_project_data,
		create_new_project_fail: state.app.create_new_project_fail,
	};
};

const mapDispatchToProps = {
	fetch_my_projects,
	create_new_project,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Projects);
