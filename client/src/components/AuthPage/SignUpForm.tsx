import React from "react";
import { ArrowLeft } from "react-feather";
import { TagInput } from "../JobListPage/TagInput";
import { InputValidateGroup, InputValidate } from "../ValidateInputField";

import joi from "joi";

export class SignUpForm extends React.Component<any> {
  registration = () => {
    this.props.registration();
  };
  render() {
    const { signUp, switchForm, addTag, removeTag, validatedSignUp } = this.props;
    return (
      <div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0">
        <button onClick={() => switchForm("AUTH")} className="btn mb-auto ml-3 position-absolute text-primary" style={{ zIndex: 3 }}>
          <ArrowLeft />
        </button>
        <div className="col-sm col-100 px-md-5 px-3 d-flex flex-column justify-content-center align-items-center">
          <p className="mb-5">Регистрация</p>
          <InputValidateGroup validated={(c, v) => validatedSignUp(1, c, v)} forceValidate={signUp.stages[1].forceValidate}>
            <p className="mr-auto mb-2">ФИО</p>
            <InputValidate name="fullname" schema={joi.string()}>
              <input className="w-100" placeholder="Иванов Иван Иванович" />
            </InputValidate>
            <p className="mr-auto mb-2">Дата рождения</p>
            <InputValidate name="dob" schema={joi.date()}>
              <input className="w-100" placeholder="ДД.ММ.ГГГГ" />
            </InputValidate>
            <p className="mr-auto mb-2">Опишите себя</p>
            <InputValidate name="description" schema={joi.string()}>
              <input className="w-100" placeholder="Дружелюбный, люблю животных, часто посещаю субботники" />
            </InputValidate>
            <p className="mr-auto mb-2">Страница соц-сети</p>
            <InputValidate name="socialUrl" schema={joi.string()}>
              <input className="w-100" placeholder="vk.com/helloitsmedio" />
            </InputValidate>
            <p className="mr-auto mb-2">Ваш город</p>
            <InputValidate name="city" schema={joi.string()}>
              <input className="w-100" placeholder="Прага" />
            </InputValidate>
            <p className="mr-auto mb-2">Ваши навыки</p>
            <TagInput className="w-100" tags={signUp.tags} addTag={addTag} removeTag={removeTag} />
          </InputValidateGroup>
          <button className="btn btn-primary w-100 rounded-0" onClick={this.registration}>
            Завершить регистрацию
          </button>
        </div>
      </div>
    );
  }
}
