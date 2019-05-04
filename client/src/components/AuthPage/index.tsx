import React from "react";

import { connect } from "react-redux";
import { accountLogin } from "../../actions/accountActions";
import { history } from "../../store";

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
    signIn: { login: "", password: "" },
    form: "AUTH"
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
    this.setState({ form });
  };

  render() {
    const { status, error } = this.props;
    const { signIn, form } = this.state;
    return switchForm(form, { status, error, login: this.login, onChange: this.onChange, signIn, switchForm: this.switchForm });
  }
}

const AuthForm = ({ signIn, login, onChange, status, error, switchForm }: any) => (
  <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0" style={{ minHeight: "85vh", zIndex: 3 }}>
    <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center" onKeyDown={e => e.key === "Enter" && login()}>
      {/* <form> */}
      <p className="mb-5">Войти</p>
      <input value={signIn.login} type="login" onChange={e => onChange(e, "signIn")} className="w-100" name="login" placeholder="Логин | Email" />
      <input value={signIn.password} type="password" onChange={e => onChange(e, "signIn")} className="w-100" name="password" placeholder="Пароль" />
      {status === "ERROR" ? <small className="text-danger my-1 align-self-start">{error.msg}</small> : ""}
      <button type="submit" onClick={login} className="btn btn-primary w-100 rounded-0">
        Войти
      </button>
      {/* </form> */}
    </div>
    <div className="col-auto d-sm-block d-none">
      <hr className="bg-muted m-0" style={{ height: "100%", width: "1px" }} />
    </div>
    <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center">
      <p className="mb-5">Зарегистрироваться</p>

      <input className="w-100" placeholder="Email" />
      <input className="w-100" placeholder="Логин" />
      <input className="w-100" placeholder="Пароль" />
      <input className="w-100" placeholder="Повторите пароль" />
      <button onClick={() => switchForm("SIGNUP")} className="btn btn-primary w-100 rounded-0">
        Регистрация
      </button>
    </div>
  </div>
);

class SignUpForm extends React.Component<any> {
  render() {
    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0">
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center">
          <p className="mb-5">Регистрация</p>
          <input className="w-100" placeholder="Email" />
          <input className="w-100" placeholder="Логин" />
          <input className="w-100" placeholder="Пароль" />
          <input className="w-100" placeholder="Повторите пароль" />
          <button className="btn btn-primary w-100 rounded-0">Завершить регистрацию</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  accountLogin
};

const mapStateToProps = (state: any) => ({
  status: state.account.status,
  error: state.account.error
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
