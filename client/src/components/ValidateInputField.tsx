import React, { ReactChild } from "react";
import joi from "joi";

class InputCheck extends React.Component<{ error?: string; idle?: string; [key: string]: any }, any> {
  render() {
    const { error, idle } = this.props;
    return (
      <small {...this.props} className={this.props.className + " mb-2 " + (error ? "text-danger" : "")}>
        {typeof error === "string" ? error : error ? "Ошибочка" : idle || ""}
      </small>
    );
  }
}

interface InputValidateProps extends React.PropsWithChildren<any> {
  // onChange?: (e: any) => void;
  // disabled?: boolean;
  hardCheck?: boolean;
  successMessage?: string;
  idleMessage?: string;

  // error?: string;
  // value?: any;
  name: string;
  schema: joi.SchemaLike;
}

const inputs = ["input", "textarea"];
export class InputValidate extends React.Component<InputValidateProps> {
  bindInputProps = (value: any) => {
    const { inputRef, onChange, name, children } = this.props;

    return React.Children.map(children, (child: any) => {
      if (!inputs.includes(child.type)) return child;
      return React.cloneElement(child, { ...child.props, onChange, value, name });
    });
  };

  render() {
    const { children, style, className, disabled, idleMessage, successMessage, error, value } = this.props;

    let message;
    if (disabled) message = idleMessage;
    else if (error) message = error;
    else message = successMessage;

    return (
      <div style={style} className={className || "w-100"}>
        {this.bindInputProps(value)}
        <small className={disabled ? "text-secondary" : error ? "text-danger" : "text-primary"}>{message}</small>
      </div>
    );
  }
}

interface InputValidateGroupProps extends React.PropsWithChildren<any> {
  validated: (correct: boolean, data: any) => void;
  forceValidate?: boolean;
}

export class InputValidateGroup extends React.Component<InputValidateGroupProps> {
  state = {
    disabled: true,
    input: {} as any,
    errors: {} as any,
    schema: {} as any
  };

  constructor(props: InputValidateGroupProps) {
    super(props);

    React.Children.forEach(props.children, c => {
      if (c.type !== InputValidate) return;
      this.state.input[c.props.name] = "";
      this.state.errors[c.props.name] = null;
      this.state.schema[c.props.name] = c.props.schema;
    });
  }

  disable = () => {
    this.setState({ disabled: true });
  };

  validate = (value: any): { error: any | null; value: any } => {
    const { schema } = this.state;
    const result = joi.validate(value, joi.object().keys(schema), { convert: true });

    if (result.error) {
      // let err = {} as any;
      let validErrors = {} as any;
      result.error.details.forEach((d: any) => {
        validErrors[d.context.key] = d.message;
      });

      return {
        error: validErrors,
        value: result.value
      };
    } else return { error: null, value: result.value };
  };

  componentDidUpdate(prevProps: any) {
    if (!prevProps.forceValidate && this.props.forceValidate) this.setState({ errors: this.validate(this.state.input).error });
  }

  onChange = (e: any, hardCheck: any) => {
    // e.preventDefault();
    let { input, errors, disabled } = this.state;
    let backup = input[e.target.name];
    input[e.target.name] = e.target.value;
    const result = this.validate(input);
    input[e.target.name] = result.value[e.target.name];
    if (hardCheck && (result.error && result.error[e.target.name])) {
      input[e.target.name] = backup;
    }
    disabled = true;
    for (let p in input) if (input[p] !== "") disabled = false;

    this.setState({ disabled, input, errors: result.error });
    this.props.validated(result.error === null, { ...input });
  };

  render() {
    const { children, forceValidate } = this.props;
    const { disabled, input, errors } = this.state;
    let empty = true;
    const childs = React.Children.map(children, (c: any) => {
      if (c.type !== InputValidate) return c;
      const value = input[c.props.name] || "";
      const error = errors && errors[c.props.name];
      return React.cloneElement<any>(c, {
        ...c.props,
        value,
        disabled: forceValidate ? false : disabled || (!error && value === ""),
        onChange: (e: any) => this.onChange(e, c.props.hardCheck),
        error: error
      });
    });

    return childs;
  }
}

export default InputCheck;
