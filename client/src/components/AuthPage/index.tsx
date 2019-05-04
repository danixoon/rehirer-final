import React from "react";

import { connect } from "react-redux";
import { accountLogin } from "../../actions/accountActions";
import { history } from "../../store";

class AuthPage extends React.Component<any> {
  state = {
    singIn: { login: "", password: "" }
  };

  login = () => {
    const { accountLogin } = this.props;
    const { login, password } = this.state.singIn;
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

  render() {
    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0" style={{ height: "80vh", zIndex: 3 }}>
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center">
          <p className="mb-5">Войти</p>
          <input type="login" onChange={e => this.onChange(e, "singIn")} className="w-100" name="login" placeholder="Логин | Email" />
          <input type="password" onChange={e => this.onChange(e, "singIn")} className="w-100" name="password" placeholder="Пароль" />
          <button onClick={this.login} className="btn btn-primary w-100 rounded-0">
            Войти
          </button>
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
          <button className="btn btn-primary w-100 rounded-0">Регистрация</button>
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
