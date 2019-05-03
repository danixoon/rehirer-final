import React from "react";
import { ArrowDown } from "react-feather";

class SortParameter extends React.Component<{ label: string; onChange?: (asc: boolean) => void } & any> {
  state = {
    asc: false
  };

  toggle = () => {
    let { asc } = this.state;
    asc = !asc;
    this.setState({ asc });
    if (this.props.onChange) this.props.onChange(asc);
  };
  render() {
    const { label } = this.props;
    const { asc } = this.state;
    return (
      <div {...this.props} onClick={this.toggle}>
        <span>{label}</span>
        <ArrowDown className="text-primary p-1" style={{ transition: "transform 0.1s ease", transform: `rotate(${asc ? 0 : 180}deg)` }} />
      </div>
    );
  }
}

export default SortParameter;