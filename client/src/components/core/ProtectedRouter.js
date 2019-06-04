import React from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import "../../css/ProtectedRouter.css";

import { Nav, Navbar } from "react-bootstrap";

// components
import Tasks from "../Tasks";
import Projects from "../Projects";
// import Settings from "../Settings";
import TaskDetailedView from "../TaskDetailedView";
import ProjectDetailedView from "../ProjectDetailedView";

class ProtectedRouter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active_nav_link: "",
		};
	}

	componentDidMount() {
		const url_splitted = this.props.location.pathname.split("/");
		if (url_splitted[url_splitted.length - 1] === "tasks") {
			this.setState({ active_nav_link: "/app/tasks" });
		} else if (url_splitted[url_splitted.length - 1] === "projects") {
			this.setState({ active_nav_link: "/app/projects" });
		}
	}

	handle_nav_item_click(menu_item_key) {
		this.setState({ active_nav_link: menu_item_key }, () => {
			this.props.history.push(menu_item_key);
		});
	}

	render() {
		const { active_nav_link } = this.state;
		return (
			<div style={{ background: "#3b4d74", height: "100vh", width: "100%" }}>
				<Nav variant="tabs" className={"mr-auto"}>
					<Navbar.Brand style={{ marginRight: 30, marginLeft: 30 }}>HAKORA</Navbar.Brand>
					<Nav.Item>
						<Nav.Link onClick={() => this.handle_nav_item_click("/app/tasks")} active={active_nav_link === "/app/tasks"}>
							Tasks
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link onClick={() => this.handle_nav_item_click("/app/projects")} active={active_nav_link === "/app/projects"}>
							Projects
						</Nav.Link>
					</Nav.Item>
					{/* <Nav.Item>
						<Nav.Link onClick={() => this.handle_nav_item_click("/app/settings")} active={active_nav_link === "/app/settings"}>
							Settings
						</Nav.Link>
					</Nav.Item> */}
				</Nav>
				<Switch>
					<Route path="/app/tasks" component={Tasks} />
					<Route path="/app/projects" component={Projects} />
					{/* <Route path="/app/settings" component={Settings} /> */}
					<Route path="/app/task/:task_id" component={TaskDetailedView} />
					<Route path="/app/project/:project_id" component={ProjectDetailedView} />
					<Redirect to="/app/tasks" />
				</Switch>
			</div>
		);
	}
}

export default withRouter(ProtectedRouter);
