import React from "react";

import { connect } from "react-redux";
import { userAccountLogin, userAccountCheckToken } from "../../store/actions/userActions";
import { history } from "../../store/store";
import axios from "axios";

import joi, { func } from "joi";
import { AuthForm } from "./AuthForm";
import { SignUpForm } from "./SignUpForm";

function switchForm(action: string, payload: any) {
  switch (action) {
    case "SIGNUP":
      return <SignUpForm {...payload} />;
    default:
      return <AuthForm {...payload} />;
  }
}

class AuthPage extends React.Component<any> {
  state = {
    signIn: {
      username: "",
      password: "",
      validate: null as any,
      schema: {
        username: joi.string().error(e => "Поле не может быть пустым"),
        password: joi.string().error(e => "Поле не может быть пустым")
      }
    },
    signUp: {
      tags: [] as string[],
      tagInput: "",
      email: "",
      username: "",
      password: "",
      passwordRepeat: "",
      fullname: "",
      dob: "",
      description: "",
      socialUrl: "",
      city: "",
      schema: {
        email: joi
          .string()
          .email()
          .error(e => "Некорректная почта"),
        password: joi
          .string()
          .min(8)
          .error(e => "Не менее 8 символов"),
        passwordRepeat: joi
          // .extend()
          .string()
          .valid(joi.ref("password"))
          .error((e: any) => "Пароли должны совпадать")
      },
      validate: null as any
    },
    form: "AUTH",
    status: "IDLE"
  };

  login = () => {
    // this.validate();
    const { accountLogin } = this.props;
    const { username, password } = this.state.signIn;

    this.validateSignIn();

    if (this.state.signIn.validate === null) accountLogin(username, password);
  };

  onChange = (e: any, obj: string) => {
    if (!obj) return this.setState({ [e.target.name]: e.target.value });
    const prop = (this.state as any)[obj];
    if (!prop) throw "Invalid prop name";
    prop[e.target.name] = e.target.value;

    this.setState({ prop });
  };

  componentDidUpdate() {
    const { user, location } = this.props;
    // console.log(location);
    if (user.statuses.account === "SUCCESS") history.push((location && location.state && location.state.redirect) || "/account/settings");
  }

  componentDidMount() {}

  switchForm = (form: string) => {
    // console.log(this.state.signUp.validate);
    this.validateSignUp();
    if (form === "SIGNUP") {
      if (!this.state.signUp.validate) this.setState({ form });
    } else this.setState({ form });
  };

  addTag = (tag: string) => {
    const signUp = this.state.signUp;
    signUp.tags.push(tag);
    this.setState({ signUp });
  };
  removeTag = (tag: string) => {
    // this.props.removeTag(tag);
    const signUp = this.state.signUp;
    signUp.tags = signUp.tags.filter(t => t != tag);

    this.setState({ signUp });
  };

  registration = () => {
    const { description, dob, password, fullname, email, tags, username, city, socialUrl } = this.state.signUp;
    this.setState({ status: "LOADING" });
    const names = fullname.split(/\s+/);
    axios
      .get("/api/account/create", {
        params: { description, dob, password, firstName: names[1], thirdName: names[2], secondName: names[0], email, tags, username, city, socialUrl }
      })
      .then(res => {
        // console.lo
        this.props.accountCheckToken(res.data.token);
      })
      .catch(console.log);
  };

  validateSignUp = () => {
    const signUp = this.state.signUp;
    // console.log("validationn");
    signUp.validate = joi.validate(this.state.signUp, signUp.schema, { allowUnknown: true, convert: true });
    if (!signUp.validate.error) signUp.validate = null;
    this.setState({ signUp });
  };

  validateSignIn = () => {
    const signIn = this.state.signIn;
    // console.log("validationn");
    signIn.validate = joi.validate(this.state.signIn, signIn.schema, { allowUnknown: true, convert: true });
    if (!signIn.validate.error) signIn.validate = null;
    this.setState({ signIn });
  };

  render() {
    const { error, user } = this.props;
    const { signIn, form, signUp } = this.state;
    return switchForm(form, {
      user,
      error,
      login: this.login,
      onChange: this.onChange,
      signIn,
      switchForm: this.switchForm,
      signUp,
      addTag: this.addTag,
      removeTag: this.removeTag,
      registration: this.registration
    });
  }
}

export function validationMessage(details: any[], field: string) {
  const det = details.find(c => c.context.key === field);
  if (det !== undefined) return det.message;
}

const mapDispatchToProps = {
  accountLogin: userAccountLogin,
  accountCheckToken: userAccountCheckToken
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  router: state.router
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
