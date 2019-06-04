import React from "react";
import "../css/Home.css";
import { connect } from "react-redux";
import { Button, ButtonGroup } from "react-bootstrap";
import { check_token_valid } from "../actions/user_actions";

class Home extends React.Component {
	componentDidMount() {
		this.check_token_valid();
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.check_token_valid_loading && nextProps.check_token_valid_data.length !== 0) {
			this.props.history.push("/app/tasks");
		}
	}

	check_token_valid() {
		this.props.check_token_valid();
	}

	render() {
		return (
			<div className={"home_main_container"}>
				<div className={"home_widget home_center"}>
					<div className={"home_blur"} />

					<div className={"home_center"}>
						<p className={"home_big_and_light_text"}>HAKORA</p>
						<div className={"home_small_text_container"}>
							<p className={"home_small_and_light_text"}>
								A simple task manager that allows you to create and manage your every-day tasks, create projects and share your workings with
								other co-workers, friends or family members
							</p>
						</div>
						<ButtonGroup aria-label="Basic example" className={"home_button_group"}>
							{/* <Button className={"home_my_button"} variant="dark" onClick={() => this.props.history.push("/about")}>
								About
							</Button> */}
							<Button className={"home_my_button"} variant="dark" onClick={() => this.props.history.push("/login")}>
								Login
							</Button>
							<Button className={"home_my_button"} variant="dark" onClick={() => this.props.history.push("/register")}>
								Register
							</Button>
						</ButtonGroup>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		check_token_valid_loading: state.user.check_token_valid_loading,
		check_token_valid_data: state.user.check_token_valid_data,
		check_token_valid_fail: state.user.check_token_valid_fail,
	};
};

const mapDispatchToProps = {
	check_token_valid,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Home);
