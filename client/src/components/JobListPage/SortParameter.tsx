import React from "react";
import { ArrowDown } from "react-feather";

class SortParameter extends React.Component<{ label: string; onChange?: (asc: boolean) => void } & any> {
  toggle = () => {
    let { value } = this.props;
    value = value === 1 ? -1 : 1; 
    if (this.props.onChange) this.props.onChange(value);
  };
  render() {
    const { label, value } = this.props;

    return (
      <div {...this.props} style={{ cursor: "pointer" }} onClick={this.toggle}>
        <span>{label}</span>
        <ArrowDown className="text-primary p-1" style={{ transition: "transform 0.1s ease", transform: `rotate(${value === 1 ? 0 : 180}deg)` }} />
      </div>
    );
  }
}

export default SortParameter;
