import React from "react";
import { connect } from "react-redux";
import { get_my_tasks, check_if_user_can_create_task } from "../actions/app_actions";
import "../css/Tasks.css";
import { Button, ButtonGroup, Modal, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

class Tasks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
	}

	componentDidMount() {
		this.props.get_my_tasks();
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
			return <div key={key}>{task.title}</div>;
		});
	}

	handle_modal_for_task_creation_close() {
		this.setState({ modal_for_task_creation_visible: false });
	}

	handle_modal_for_task_creation_open() {
		// first check if user has any projects
		this.props.check_if_user_can_create_task();
		// this.setState({ modal_for_task_creation_visible: true });
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
							initialValues={{ title: "", description: "" }}
							onSubmit={(values, { setSubmitting }) => {
								console.log(values);
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
							})}
						>
							{(props) => {
								const { values, touched, errors, handleChange, handleBlur, handleSubmit } = props;
								return (
									<div>
										<Form onSubmit={handleSubmit} className={"login_form"}>
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
													type="textarea"
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
	};
};

const mapDispatchToProps = {
	get_my_tasks,
	check_if_user_can_create_task,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Tasks);
