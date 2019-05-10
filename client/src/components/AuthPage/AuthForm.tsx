import React from "react";
import InputCheck, { InputValidateGroup, InputValidate } from "../ValidateInputField";

import joi, { any } from "joi";

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
            <p className="mr-auto mb-2">Ваш логин/email</p>
            <InputValidate name="username" schema={joi.string()}>
              <input type="username" className="w-100 mb-2" placeholder="Логин | Email" />
            </InputValidate>
            <p className="mr-auto mb-2">Ваш пароль</p>
            <InputValidate
              name="password"
              overrideError={user.statuses.account.auth === "ERROR" && user.errors.account.auth.msg}
              schema={joi.string().error(e => "Обязательное поле")}
            >
              <input type="password" className="w-100 mb-2" placeholder="Пароль" />
            </InputValidate>
            {/* <InputCheck className="mr-auto" error={validationMessage(signInDetails, "password")} /> */}
            {/* {user.statuses.account === "ERROR" ? <small className="text-danger my-1 align-self-start">{}</small> : ""} */}
          </InputValidateGroup>
          <button onClick={login} className={"btn btn-primary w-100 rounded-0 mt-2 "}>
            Войти
          </button>
        </div>
        <div className="col-auto d-sm-block d-none">
          <hr className="bg-muted m-0" style={{ height: "100%", width: "1px" }} />
        </div>
        <div
          onKeyDown={e => e.key === "Enter" && this.switchForm("SIGNUP")}
          className="col-sm mt-5 col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center"
        >
          <p className="mb-5">Зарегистрироваться</p>
          <InputValidateGroup validated={(c, d) => validatedSignUp(0, c, d)} forceValidate={signUp.stages[0].forceValidate}>
            <p className="mr-auto my-2">Email</p>
            <InputValidate
              name="email"
              raw
              idleMessage="Связь с вами"
              successMessage="Отлично"
              schema={joi
                .string()
                .email()
                .error((e: any) => "Необходим корректный email")}
            >
              <input type="email" className="w-100 mb-2" placeholder="somebody@post.com" />
            </InputValidate>
            <p className="mr-auto my-2">Логин</p>
            <InputValidate
              name="username"
              idleMessage="Введите ваш логин"
              successMessage="Отлично"
              schema={joi
                .string()
                .min(4)
                .error(e => "Не менее 4 символов")}
            >
              <input type="username" className="w-100 mb-2" placeholder="somebody123" />
            </InputValidate>
            <p className="mr-auto my-2">Пароль</p>
            <InputValidate
              name="password"
              successMessage="Отлично"
              schema={joi
                .string()
                .min(8)
                .error(e => "Не менее 8 символов")}
            >
              <input type="password" className="w-100" placeholder="********" />
            </InputValidate>
            <p className="mr-auto my-2">Повторите пароль</p>
            <InputValidate name="passwordRepeat" successMessage="Отлично" schema={joi.valid(joi.ref("password")).error(e => "Пароли не совпадают")}>
              <input type="password" className="w-100 mb-2" placeholder="********" />
            </InputValidate>
          </InputValidateGroup>
          <button onClick={() => this.switchForm("SIGNUP")} className={"btn btn-primary w-100 rounded-0 mt-2 "}>
            Регистрация
          </button>
        </div>
      </div>
    );
  }
}
