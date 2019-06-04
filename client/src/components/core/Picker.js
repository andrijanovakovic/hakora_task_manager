import React from "react";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import { toast } from 'react-toastify';

class Picker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data ? this.props.data : [],
			loading: false,
			selected_item: this.props.selected_item ? this.props.selected_item : null,
			request_url: this.props.request_url ? this.props.request_url : null,
			request_params: this.props.request_params ? this.props.request_params : null,
		};
	}

	componentDidMount() {
		if (this.state.request_url) {
			this.get_data();
		}
	}

	get_data() {
		this.setState({ loading: true });
		const { request_url, request_params } = this.state;
		axios
			.post(request_url, request_params)
			.then((res) => {
				if (res.data && res.data.data) {
					this.setState({ data: res.data.data, loading: false });
				}
			})
			.catch((err) => {
                toast.error("Error occured while trying to fetch new data for the picker, please try again later...");
				console.error(err);
			});
	}

	select_item(item) {
		this.setState({ selected_item: item }, () => {
			this.props.on_select(item);
		});
	}

	render_items() {
		if (this.state.data.length === 0) {
			return <Dropdown.Item disabled>No data...</Dropdown.Item>;
		}
		return this.state.data.map((item, key) => {
			return (
				<Dropdown.Item onClick={() => this.select_item(item)} key={key}>
					{item[this.props.show_property]}
				</Dropdown.Item>
			);
		});
	}

	render() {
		return (
			<Dropdown>
				<Dropdown.Toggle
					id="dropdown-custom-components"
					style={{ width: "100%", background: "white", border: "1px solid rgb(206, 212, 218)", color: "#5d5c61" }}
				>
					{this.state.selected_item ? this.state.selected_item[this.props.show_property] : "Please choose"}
				</Dropdown.Toggle>

				<Dropdown.Menu style={{ width: "100%", background: "#eee" }}>
					{this.state.selected_item ? (
						<Dropdown.Item onClick={() => this.select_item(null)} style={{ color: "red" }}>
							De-select
						</Dropdown.Item>
					) : null}

					{this.render_items()}
				</Dropdown.Menu>
			</Dropdown>
		);
	}
}

export default Picker;
