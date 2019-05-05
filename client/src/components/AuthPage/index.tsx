import React from "react";

import { connect } from "react-redux";
import { accountLogin, accountCheckToken } from "../../actions/accountActions";
import { history } from "../../store";
import { ArrowLeft } from "react-feather";
import { TagInput } from "../JobListPage/TagInput";
import axios from "axios";
import InputCheck from "../ValidateInputField";

import joi, { func } from "joi";

function switchForm(action: string, payload: any) {
  switch (action) {
    case "SIGNUP":
      return <SignUpForm {...payload} />;
    default:
      return <AuthForm {...payload} />;
  }
}
function isEmpty(str: string) {
  return str === undefined || str === null || str.length === 0 || !str.trim();
}

const usernameExtend: joi.Extension = {
  base: joi.string(),
  name: "username",
  language: {
    exists: "already exists"
  },
  rules: [
    {
      name: "exists",
      validate(params, value, state, options) {
        if (!value.exists) {
          return this.createError("username.exists", {}, state, options);
        }
        return value; // Everything is OK
      }
    }
  ]
};

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
    const { status, location } = this.props;
    // console.log(location);
    if (status === "SUCCESS") history.push((location && location.state && location.state.redirect) || "/account/settings");
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
    const { status, error } = this.props;
    const { signIn, form, signUp } = this.state;
    return switchForm(form, {
      status,
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

function validationMessage(details: any[], field: string) {
  const det = details.find(c => c.context.key === field);
  if (det !== undefined) return det.message;
}

class AuthForm extends React.Component<any> {
  switchForm = (form: string) => {
    this.props.switchForm(form);
  };

  render() {
    const { signIn, signUp, login, onChange, status, error, switchForm } = this.props;
    const signUpDetails = (signUp.validate && signUp.validate.error.details) || [];
    const signInDetails = (signIn.validate && signIn.validate.error.details) || [];
    // console.log(signUpDetails);
    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0" style={{ minHeight: "85vh", zIndex: 3 }}>
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center" onKeyDown={e => e.key === "Enter" && login()}>
          {/* <form> */}
          <p className="mb-5">Войти</p>
          <input value={signIn.username} type="username" onChange={e => onChange(e, "signIn")} className="w-100" name="username" placeholder="Логин | Email" />
          <InputCheck className="mr-auto" error={validationMessage(signInDetails, "username")} />
          <input value={signIn.password} type="password" onChange={e => onChange(e, "signIn")} className="w-100" name="password" placeholder="Пароль" />
          <InputCheck className="mr-auto" error={validationMessage(signInDetails, "password")} />
          {status === "ERROR" ? <small className="text-danger my-1 align-self-start">{error.msg}</small> : ""}
          <button onClick={login} className={"btn btn-primary w-100 rounded-0 "}>
            Войти
          </button>
          {/* </form> */}
        </div>
        <div className="col-auto d-sm-block d-none">
          <hr className="bg-muted m-0" style={{ height: "100%", width: "1px" }} />
        </div>
        <div onKeyDown={e => e.key === "Enter" && this.switchForm("SIGNUP")} className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center">
          <p className="mb-5">Зарегистрироваться</p>
          <input type="email" name="email" value={signUp.email} onChange={e => onChange(e, "signUp")} className="w-100 mb-2" placeholder="Email" />
          <InputCheck className="mr-auto" error={validationMessage(signUpDetails, "email")} />
          <input type="username" name="username" value={signUp.username} onChange={e => onChange(e, "signUp")} className="w-100" placeholder="Логин" />
          <input type="password" name="password" value={signUp.password} onChange={e => onChange(e, "signUp")} className="w-100" placeholder="Пароль" />
          <InputCheck className="mr-auto" error={validationMessage(signUpDetails, "password")} />
          <input type="password" name="passwordRepeat" value={signUp.passwordRepeat} onChange={e => onChange(e, "signUp")} className="w-100" placeholder="Повторите пароль" />
          <InputCheck className="mr-auto" error={validationMessage(signUpDetails, "passwordRepeat")} />
          <button onClick={() => this.switchForm("SIGNUP")} className={"btn btn-primary w-100 rounded-0 "}>
            Регистрация
          </button>
        </div>
      </div>
    );
  }
}

class SignUpForm extends React.Component<any> {
  registration = () => {
    this.props.registration();
  };

  render() {
    const { signUp, onChange, status, error, switchForm, addTag, removeTag } = this.props;
    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0">
        <button onClick={() => switchForm("AUTH")} className="btn mb-auto ml-3 position-absolute text-primary" style={{ zIndex: 3 }}>
          <ArrowLeft />
        </button>
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center">
          <p className="mb-5">Регистрация</p>
          <p className="mr-auto mb-2">ФИО</p>
          <input value={signUp.fullname} onChange={e => onChange(e, "signUp")} name="fullname" className="w-100" placeholder="Иванов Иван Иванович" />
          <p className="mr-auto mb-2">Дата рождения</p>
          <input value={signUp.dob} onChange={e => onChange(e, "signUp")} name="dob" className="w-100" placeholder="19.12.1992" />
          <p className="mr-auto mb-2">Опишите себя</p>
          <input
            value={signUp.description}
            onChange={e => onChange(e, "signUp")}
            name="description"
            className="w-100"
            placeholder="Дружелюбный, люблю животных, часто посещаю субботники"
          />
          <p className="mr-auto mb-2">Страница соц-сети</p>
          <input value={signUp.socialUrl} onChange={e => onChange(e, "signUp")} name="socialUrl" className="w-100" placeholder="vk.com/helloitsmedio" />
          <p className="mr-auto mb-2">Ваш город</p>
          <input value={signUp.city} onChange={e => onChange(e, "signUp")} name="city" className="w-100" placeholder="Прага" />
          <p className="mr-auto mb-2">Ваши навыки</p>
          <TagInput className="w-100" tags={signUp.tags} addTag={addTag} removeTag={removeTag} />
          {/* <input className="w-100" placeholder="Че умееш?" /> */}
          <button className="btn btn-primary w-100 rounded-0" onClick={this.registration}>
            Завершить регистрацию
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  accountLogin,
  accountCheckToken
};

const mapStateToProps = (state: any) => ({
  status: state.account.status,
  error: state.account.error,
  router: state.router
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
