import React from "react";
import InputCheck, { InputValidateGroup, InputValidate } from "../ValidateInputField";

import joi from "joi";

export class AuthForm extends React.Component<any> {
  switchForm = (form: string) => {
    const { forceSignUpValidate } = this.props;
    if (form === "SIGNUP") {
      const { signUp } = this.props;
      if (!signUp.stages[0].correct) return forceSignUpValidate(0);
    }
    this.props.switchForm(form);
  };

  render() {
    const { signIn, signUp, login, onChange, user, error, switchForm, validatedSignIn, validatedSignUp, forceSignUpValidate } = this.props;

    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0" style={{ minHeight: "85vh", zIndex: 3 }}>
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center" onKeyDown={e => e.key === "Enter" && login()}>
          <p className="mb-5">Войти</p>
          <InputValidateGroup validated={validatedSignIn} forceValidate={signIn.forceValidate}>
            <InputValidate name="username" schema={joi.string().error(e => "Обязательное поле")}>
              <input type="username" className="w-100" placeholder="Логин | Email" />
            </InputValidate>
            {/* <InputCheck className="mr-auto" error={validationMessage(signInDetails, "username")} /> */}
            <InputValidate name="password" schema={joi.string().error(e => "Обязательное поле")}>
              <input type="password" className="w-100" placeholder="Пароль" />
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
          <InputValidateGroup validated={(c, d) => validatedSignUp(0, c, d)} forceValidate={signIn.forceValidate}>
            <InputValidate
              name="email"
              schema={joi
                .string()
                .email()
                .error(e => "Необходим корректный email")}
            >
              <input type="email" className="w-100 mb-2" placeholder="Email" />
            </InputValidate>
            <InputValidate
              name="username"
              schema={joi
                .string()
                .min(4)
                .error(e => "Не менее 4 символов")}
            >
              <input type="username" className="w-100" placeholder="Логин" />
            </InputValidate>
            <InputValidate
              name="password"
              schema={joi
                .string()
                .min(8)
                .error(e => "Не менее 8 символов")}
            >
              <input type="password" className="w-100" placeholder="Пароль" />
            </InputValidate>
            <InputValidate name="passwordRepeat" schema={joi.valid(joi.ref("password")).error(e => "Пароли не совпадают")}>
              <input type="password" className="w-100" placeholder="Повторите пароль" />
            </InputValidate>
          </InputValidateGroup>
          <button onClick={() => this.switchForm("SIGNUP")} className={"btn btn-primary w-100 rounded-0 "}>
            Регистрация
          </button>
        </div>
      </div>
    );
  }
}
