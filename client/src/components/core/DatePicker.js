import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/datepicker.css";

class MyDatePicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_year_dropdown: this.props.show_year_dropdown === false ? false : true,
			selected_date: this.props.selected_date ? this.props.selected_date : new Date(),
			show_time_select: this.props.show_time_select === false ? false : true,
			read_only: this.props.read_only && this.props.read_only === true ? true : false,
		};
	}

	handle_change(date) {
		this.setState({ selected_date: date }, () => {
			this.props.on_change(this.state.selected_date);
		});
	}

	render() {
		return (
			<DatePicker
				readOnly={this.state.read_only}
				style={{ width: "100%" }}
				className={"form-control"}
				timeFormat="HH:mm"
				timeIntervals={5}
				timeCaption="Time"
				dateFormat={this.state.show_time_select ? "d MMMM, yyyy HH:mm" : "d MMMM, yyyy"}
				showYearDropdown={this.state.show_year_dropdown}
				showTimeSelect={this.state.show_time_select}
				yearDropdownItemNumber={5}
				selected={this.state.selected_date}
				onChange={(date) => this.handle_change(date)}
			/>
		);
	}
}

export default MyDatePicker;
