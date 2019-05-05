import React from "react";

class InputCheck extends React.Component<{ error?: string } & any, any> {
  render() {
    const { error } = this.props;
    return (
      <small {...this.props} className={this.props.className + " mb-2 " + (error ? "text-danger" : "text-success")}>
        {typeof error === "string" ? error : error ? "Ошибочка" : ""}
      </small>
    );
  }
}

export default InputCheck;
