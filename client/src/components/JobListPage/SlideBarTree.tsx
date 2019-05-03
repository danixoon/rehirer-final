import React from "react";
import Spoiler from "./Spoiler";
import { X } from "react-feather";

interface ISlideBarTreeProps {
  header: string;
  placeholder: string;
  items: { label: string; onClick?: (e: any) => void }[];
  onSubmit?: (value: string) => void;
}

class SlideBarTree extends React.Component<ISlideBarTreeProps> {
  state = {
    input: "",
    open: false
  };

  onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e: any, value: string) => {
    const { onSubmit } = this.props;
    if (!onSubmit) return;
    e.target.value = "";
    this.onChange(e);

    onSubmit(value);
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { header, items, placeholder } = this.props;
    const { input, open } = this.state;
    // this.

    return (
      <Spoiler header={header} height={items.length * 3 + 4}>
        {items.map((item, i) => (
          <div className="text-secondary" key={i}>
            <X className="text-primary mr-2 p-1" onClick={item.onClick} />
            <span className="d-inline text-truncate">{item.label}</span>
          </div>
        ))}
        <input
          className="mb-2"
          placeholder={placeholder}
          name="input"
          value={input}
          onChange={this.onChange}
          onKeyDown={e => (e.key === "Enter" ? this.onSubmit(e, input) : "")}
          style={{ marginLeft: "2rem", width: "calc(100% - 2rem)" }}
        />
      </Spoiler>
    );
  }
}

export default SlideBarTree;
