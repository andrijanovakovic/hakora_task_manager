import moment from "moment";

export const truncate_string = (string, max_len) => {
	if (string.length > max_len) {
		return string.substring(0, max_len) + "...";
	}
	return string;
};

export const convert_milliseconds_to_seconds = (number) => {
	return number / 1000;
};

export const momentify = (milliseconds, stringify = false, hakora_format = "D. MMMM. YYYY HH:mm") => {
	let _date = moment
		.unix(convert_milliseconds_to_seconds(milliseconds))
		.utc()
		.local();
	if (stringify) {
		return _date.format(hakora_format);
	}
	return _date;
};
