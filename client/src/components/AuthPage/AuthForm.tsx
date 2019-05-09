import React from "react";
import InputCheck, { InputValidateGroup, InputValidate } from "../ValidateInputField";
import { validationMessage } from "./index";

import joi from "joi";

export class AuthForm extends React.Component<any> {
  switchForm = (form: string) => {
    this.props.switchForm(form);
  };

  state = {
    forceValidate: false,
    correct: false,
    input: {} as any
  };

  validated = (correct: boolean, value: any) => {
    this.setState({ correct, input: value });
  };

  render() {
    const { signIn, signUp, login, onChange, user, error, switchForm } = this.props;
    const signUpDetails = (signUp.validate && signUp.validate.error.details) || [];
    const signInDetails = (signIn.validate && signIn.validate.error.details) || [];
    // console.log(signUpDetails);
    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0" style={{ minHeight: "85vh", zIndex: 3 }}>
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center" onKeyDown={e => e.key === "Enter" && login()}>
          <p className="mb-5">Войти</p>
          <InputValidateGroup validated={this.validated}>
            <InputValidate name="username" schema={joi.string()}>
              <input value={signIn.username} type="username" onChange={e => onChange(e, "signIn")} className="w-100" name="username" placeholder="Логин | Email" />
            </InputValidate>
            {/* <InputCheck className="mr-auto" error={validationMessage(signInDetails, "username")} /> */}
            <InputValidate name="password" schema={joi.string()}>
              <input value={signIn.password} type="password" onChange={e => onChange(e, "signIn")} className="w-100" name="password" placeholder="Пароль" />
            </InputValidate>
            {/* <InputCheck className="mr-auto" error={validationMessage(signInDetails, "password")} /> */}
            {user.statuses.account === "ERROR" ? <small className="text-danger my-1 align-self-start">{user.errors.account.msg}</small> : ""}
          </InputValidateGroup>
          <button onClick={login} className={"btn btn-primary w-100 rounded-0 "}>
            Войти
          </button>
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
