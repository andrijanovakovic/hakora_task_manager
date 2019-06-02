import React from "react";
import "../css/Projects.css";
import { connect } from "react-redux";
import { fetch_my_projects } from "../actions/app_actions";

class Projects extends React.Component {
	componentDidMount() {
		this.props.fetch_my_projects();
	}

	render() {
		return (
			<div className={"projects_main_container"}>
				<p>Projects</p>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		fetch_my_projects_loading: state.app.fetch_my_projects_loading,
		fetch_my_projects_data: state.app.fetch_my_projects_data,
		fetch_my_projects_fail: state.app.fetch_my_projects_fail,
	};
};

const mapDispatchToProps = {
	fetch_my_projects,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Projects);
