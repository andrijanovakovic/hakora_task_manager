import React from "react";
import "../css/Home.css";
import { Button, ButtonGroup } from "react-bootstrap";

class Home extends React.Component {
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
							<Button className={"home_my_button"} variant="dark" onClick={() => this.props.history.push("/about")}>
								About
							</Button>
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

export default Home;
