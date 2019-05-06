import React from "react";

class InputCheck extends React.Component<{ error?: string; idle?: string } & any, any> {
  render() {
    const { error, idle } = this.props;
    return (
      <small {...this.props} className={this.props.className + " mb-2 " + (error ? "text-danger" : "")}>
        {typeof error === "string" ? error : error ? "Ошибочка" : idle || ""}
      </small>
    );
  }
}

export default InputCheck;
