import axios from "axios";

export const login_user = (user_data) => {
	axios
		.post("/api/auth/login", user_data)
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.error(err);
		});
};
