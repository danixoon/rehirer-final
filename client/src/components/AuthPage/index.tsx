import React from "react";

import { connect } from "react-redux";
import { accountLogin, accountCheckToken } from "../../actions/accountActions";
import { history } from "../../store";
import { ArrowLeft } from "react-feather";
import { TagInput } from "../JobListPage/TagInput";
import axios from "axios";

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

class AuthPage extends React.Component<any> {
  state = {
    signIn: { login: "", password: "" },
    signUp: {
      tags: [] as string[],
      tagInput: "",
      email: "",
      username: "",
      password: "",
      passwordRepeat: "",
      fullname: "",
      dob: "",
      description: ""
    },
    form: "AUTH",
    status: "IDLE"
  };

  login = () => {
    const { accountLogin } = this.props;
    const { login, password } = this.state.signIn;
    accountLogin(login, password);
  };

  onChange = (e: any, obj: string) => {
    if (!obj) return this.setState({ [e.target.name]: e.target.value });
    const prop = (this.state as any)[obj];
    if (!prop) throw "Invalid prop name";
    prop[e.target.name] = e.target.value;
    this.setState({ prop });
  };

  componentDidUpdate() {
    const { status } = this.props;
    if (status === "SUCCESS") history.push("/account/settings");
  }

  switchForm = (form: string) => {
    if (form === "SIGNUP") {
      const field = ["username", "password", "passwordRepeat", "email"].find(v => isEmpty((this.state.signUp as any)[v]));
      if (field !== undefined) return console.log("OH GOD");
      this.setState({ form });
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
    const { description, dob, password, fullname, email, tags, username } = this.state.signUp;
    this.setState({ status: "LOADING" });
    const names = fullname.split(/\s+/);
    axios
      .get("/api/account/create", { params: { description, dob, password, firstName: names[1], thirdName: names[2], secondName: names[0], email, tags, username } })
      .then(res => {
        // console.lo 
        this.props.accountCheckToken(res.data.token);
      })
      .catch(console.log);
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

class AuthForm extends React.Component<any> {
  switchForm = (form: string) => {
    this.props.switchForm(form);
  };

  render() {
    const { signIn, signUp, login, onChange, status, error, switchForm } = this.props;
    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0" style={{ minHeight: "85vh", zIndex: 3 }}>
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center" onKeyDown={e => e.key === "Enter" && login()}>
          {/* <form> */}
          <p className="mb-5">Войти</p>
          <input value={signIn.login} type="login" onChange={e => onChange(e, "signIn")} className="w-100" name="login" placeholder="Логин | Email" />
          <input value={signIn.password} type="password" onChange={e => onChange(e, "signIn")} className="w-100" name="password" placeholder="Пароль" />
          {status === "ERROR" ? <small className="text-danger my-1 align-self-start">{error.msg}</small> : ""}
          <button onClick={login} className="btn btn-primary w-100 rounded-0">
            Войти
          </button>
          {/* </form> */}
        </div>
        <div className="col-auto d-sm-block d-none">
          <hr className="bg-muted m-0" style={{ height: "100%", width: "1px" }} />
        </div>
        <div onKeyDown={e => e.key === "Enter" && this.switchForm("SIGNUP")} className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center">
          <p className="mb-5">Зарегистрироваться</p>

          <input type="email" name="email" value={signUp.email} onChange={e => onChange(e, "signUp")} className="w-100" placeholder="Email" />
          <input type="username" name="username" value={signUp.username} onChange={e => onChange(e, "signUp")} className="w-100" placeholder="Логин" />
          <input type="password" name="password" value={signUp.password} onChange={e => onChange(e, "signUp")} className="w-100" placeholder="Пароль" />
          <input type="password" name="passwordRepeat" value={signUp.passwordRepeat} onChange={e => onChange(e, "signUp")} className="w-100" placeholder="Повторите пароль" />
          <button onClick={() => this.switchForm("SIGNUP")} className="btn btn-primary w-100 rounded-0">
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
  error: state.account.error
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
