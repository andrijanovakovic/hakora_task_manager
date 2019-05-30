import React from "react";
import "../css/Home.css";
import { Button, ButtonGroup } from "react-bootstrap";

class Home extends React.Component {
	render() {
		console.log(this.props);
		return (
			<div className={"body_main_container"}>
				<div className={"widget center"}>
					<div className={"blur"} />

					<div className={"text center"}>
						<p className={"big_and_light_text"}>HAKORA</p>
						<div className={"small_text_container"}>
							<p className={"small_and_light_text"}>
								A simple task manager allows you to create and manage your every-day tasks, create projects and share your workings with other
								co-workers, friends or family members
							</p>
						</div>
						<ButtonGroup aria-label="Basic example" className={"home_button_group"}>
							<Button className={"my_button"} variant="dark" onClick={() => this.props.history.push("/about")}>
								About
							</Button>
							<Button className={"my_button"} variant="dark" onClick={() => this.props.history.push("/login")}>
								Login
							</Button>
							<Button className={"my_button"} variant="dark" onClick={() => this.props.history.push("/register")}>
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
