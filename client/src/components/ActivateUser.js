import React from "react";
import "../css/ActivateUser.css";
import "react-datepicker/dist/react-datepicker.css";
import "../css/datepicker.css";
import { activate_user } from "../actions/user_actions";
import { connect } from "react-redux";
import { toast } from "react-toastify";

class ActivateUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.props.activate_user(this.props.match.params.active_hash);
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.user_activation_loading && nextProps.user_activation_data.length !== 0) {
			if (nextProps.user_activation_data.message) {
				toast.success(nextProps.user_activation_data.message);
				if (nextProps.user_activation_data.redirect) {
					toast("You will be redirected to " + nextProps.user_activation_data.redirect_page + " in 5 seconds.");
					setTimeout(() => this.props.history.push(nextProps.user_activation_data.redirect), 5000);
				}
			}
		}
		if (!nextProps.user_activation_loading && nextProps.user_activation_fail.length !== 0) {
			if (nextProps.user_activation_fail.message) {
				toast.error(nextProps.user_activation_fail.message);
				if (nextProps.user_activation_fail.redirect) {
					toast("You will be redirected to " + nextProps.user_activation_fail.redirect_page + " in 5 seconds.");
					setTimeout(() => this.props.history.push(nextProps.user_activation_fail.redirect), 5000);
				}
			}
		}
	}

	render() {
		return (
			<div className={"register_main_container"}>
				<div className={"register_widget register_center"}>
					<div className={"register_header_container"}>
						<p className={"register_big_and_light_text"}>Please wait...</p>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user_activation_loading: state.user.user_activation_loading,
		user_activation_data: state.user.user_activation_data,
		user_activation_fail: state.user.user_activation_fail,
	};
};

const mapDispatchToProps = {
	activate_user,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ActivateUser);
