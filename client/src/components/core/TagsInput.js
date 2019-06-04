import React from "react";
import { WithContext as ReactTags } from "react-tag-input";
import "../../css/TagsInput.css";
import axios from "axios";
import { toast } from "react-toastify";

const KeyCodes = {
	comma: 188,
	enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class TagsInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tags: this.props.tags ? this.props.tags : [],
			suggestions: [],
			suggestions_url: this.props.suggestions_url ? this.props.suggestions_url : null,
			suggestions_params: this.props.suggestions_params ? this.props.suggestions_params : null,
			random_tags_allowed: this.props.random_tags_allowed === false ? false : true,
			labelField: this.props.label_field ? this.props.label_field : "text",
			protected_tag: this.props.protected_tag && this.props.protected_tag.id ? this.props.protected_tag : null,
		};

		this.handleDelete = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.get_data = this.get_data.bind(this);
	}

	componentDidMount() {
		// this means that data is not given locally and need to send request for the data
		if (this.state.suggestions_url) {
			this.get_data();
		}
	}

	get_data() {
		this.setState({ loading: true });
		const { suggestions_url, suggestions_params } = this.state;
		axios
			.post(suggestions_url, suggestions_params)
			.then((res) => {
				if (res.data && res.data.data) {
					let data = [];
					for (var i = 0, len = res.data.data.length; i < len; i++) {
						data.push(res.data.data[i]);
						if ("_id" in data[i]) {
							data[i].id = data[i]._id.$oid;
						}
					}
					this.setState({ suggestions: data, loading: false });
				}
			})
			.catch((err) => {
				toast.error("Error occured while trying to fetch new data for the tags input field, please try again later...");
				console.error(err);
			});
	}

	handleDelete(i) {
		const { tags, protected_tag } = this.state;
		if (protected_tag && tags[i].id === protected_tag.id) {
			toast.error("This is a protected tag and it cannot be removed!");
		} else {
			this.setState(
				{
					tags: tags.filter((tag, index) => index !== i),
				},
				() => {
					this.props.onChange(this.state.tags);
				},
			);
		}
	}

	tag_already_exist(tag) {
		for (var i = 0, len = this.state.tags.length; i < len; i++) {
			if (this.state.tags[i].id === tag.id) {
				return true;
			}
		}
		return false;
	}

	tag_exists_in_suggestions(tag) {
		for (var i = 0, len = this.state.suggestions.length; i < len; i++) {
			if (this.state.suggestions[i].id === tag.id) {
				return true;
			}
		}
		return false;
	}

	handleAddition(tag) {
		if (this.tag_already_exist(tag)) {
			toast.error("That tag is already selected!");
		} else {
			if (this.state.random_tags_allowed) {
				this.setState(
					(state) => ({ tags: [...state.tags, tag] }),
					() => {
						this.props.onChange(this.state.tags);
					},
				);
			} else {
				if (this.tag_exists_in_suggestions(tag)) {
					this.setState(
						(state) => ({ tags: [...state.tags, tag] }),
						() => {
							this.props.onChange(this.state.tags);
						},
					);
				} else {
					toast.error("Tag '" + tag[this.props.label_field] + "' does not exist in suggestions and it cannot be added.");
				}
			}
		}
	}

	handleDrag(tag, currPos, newPos) {
		const tags = [...this.state.tags];
		const newTags = tags.slice();

		newTags.splice(currPos, 1);
		newTags.splice(newPos, 0, tag);

		// re-render
		this.setState({ tags: newTags });
	}

	render() {
		const { tags, suggestions, labelField } = this.state;
		return (
			<div style={{ display: "flex", width: "100%" }}>
				<ReactTags
					className={"form-control"}
					tags={tags}
					suggestions={suggestions}
					handleDelete={this.handleDelete}
					handleAddition={this.handleAddition}
					handleDrag={this.handleDrag}
					delimiters={delimiters}
					style={{ width: "100%" }}
					labelField={labelField}
				/>
			</div>
		);
	}
}

export default TagsInput;
