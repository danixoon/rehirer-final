import React from "react";
import { Plus } from "react-feather";

interface ITagInputProps {
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

export class TagInput extends React.Component<ITagInputProps> {
  state = {
    tagInput: ""
  };
  addTag = (tag: string) => {
    this.props.addTag(tag);
    // const { tags } = this.state;
    // this.setState({ tags: [...tags, tag], tagInput: "" });
  };
  removeTag = (tag: string) => {
    this.props.removeTag(tag);
    // const { tags } = this.state;
    // this.setState({ tags: tags.filter(t => t != tag) });
  };
  onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { tagInput } = this.state;
    const { tags, addTag, removeTag } = this.props;
    return (
      <div>
        <div className="d-flex flex-wrap mb-2">
          {tags.map((t, i) => (
            <div onClick={() => this.removeTag(t)} className="bg-primary text-light p-1 m-1 rounded" style={{ cursor: "pointer" }} key={i}>
              {t}
            </div>
          ))}
        </div>
        <div className="d-flex">
          <input
            className="w-100"
            value={tagInput}
            onKeyDown={k => (k.key === "Enter" ? addTag(tagInput) : "")}
            placeholder="Уборщик"
            name="tagInput"
            onChange={this.onChange}
          />
          <button className="btn p-0" onClick={() => addTag(tagInput)}>
            <Plus className="text-muted" />
          </button>
        </div>
      </div>
    );
  }
}