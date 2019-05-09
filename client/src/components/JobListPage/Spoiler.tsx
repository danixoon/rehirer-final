import React from "react";
import { ChevronDown } from "react-feather";

class Spoiler extends React.Component<{ header: string; height: number } & any> {
  state = {
    open: false
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { children, header, height } = this.props;
    const { open } = this.state;
    return (
      <div className="d-flex flex-column">
        <p className="text-dark mb-1" onClick={this.toggle}>
          <ChevronDown className="text-primary p-1" style={{ transition: "transform 0.1s ease", transform: `rotate(${open ? 0 : -90}deg)` }} />
          {header}
        </p>
        <div style={{ overflow: "hidden", whiteSpace: "nowrap", maxHeight: open ? `${height}rem` : "0px", transition: "max-height 0.2s ease" }}>{children}</div>
      </div>
    );
  }
}

export default Spoiler;
