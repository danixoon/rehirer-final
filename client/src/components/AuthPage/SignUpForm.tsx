import React from "react";
import { ArrowLeft } from "react-feather";
import { TagInput } from "../JobListPage/TagInput";
import { InputValidateGroup, InputValidate } from "../ValidateInputField";

import joi from "joi";

export const signUpExtend: any = joi.extend((j: any) => ({
  name: "signUp",
  base: j.string(),
  rules: [
    {
      name: "date",
      validate: function(this: any, params: any, value: string, state: any, options: any) {
        const error = this.createError("signUp.date", { v: value }, state, options);
        const [day, month, year] = value.split(".");
        if (!day || !month || !year) return error;
        // const day = Number(dates[0]),
        //   month = Number(dates[1]),
        //   year = Number(dates[2]);
        // if (Number.isNaN(day) || Number.isNaN(year) || Number.isNaN(month)) return error;
        try {
          const date = new Date(`${year}.${month}.${day}`);
          if (isNaN(date.getTime()) || date.getFullYear() <= 1900 || date.getFullYear() >= new Date().getFullYear() - 10) return error;
          else return value;
        } catch (err) {
          return error;
        }
      }
    },
    {
      name: "fullname",
      validate: function(this: any, params: any, value: string, state: any, options: any) {
        const error = this.createError("signUp.fullname", { v: value }, state, options);
        const [firstName, secondName, thirdName] = value.split(/\s+/);
        if (!firstName || !secondName) return error;
        else return value;
        // const day = Number(dates[0]),
        //   month = Number(dates[1]),
        //   year = Number(dates[2]);
        // if (Number.isNaN(day) || Number.isNaN(year) || Number.isNaN(month)) return error;
      }
    }
  ]
}));

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
            <p className="mr-auto my-2">ФИО</p>
            <InputValidate
              name="fullname"
              successMessage="Отлично"
              schema={signUpExtend
                .signUp()
                .fullname()
                .required()
                .error((e: any) => "Неверное ФИО")}
            >
              <input className="w-100 mb-2" placeholder="Иванов Иван Иванович" />
            </InputValidate>
            <p className="mr-auto my-2">Дата рождения</p>
            <InputValidate
              name="dob"
              // idleMessage=""
              successMessage="Отлично"
              raw
              schema={signUpExtend
                .signUp()
                .date()
                .required()
                .error((e: any) => "Некорректная дата рождения")}
            >
              <input className="w-100 mb-2" placeholder="ДД.ММ.ГГГГ" />
            </InputValidate>
            <p className="mr-auto my-2">Опишите себя</p>
            <InputValidate
              name="description"
              idleMessage="Описание помогает составить портрет о Вас"
              successMessage="Отлично"
              convert
              schema={joi
                .string()
                .required()
                .error(e => "Необходимое поле")}
            >
              <input className="w-100 mb-2" placeholder="Дружелюбный, люблю животных, часто посещаю субботники" />
            </InputValidate>
            <p className="mr-auto my-2">Страница соц-сети</p>
            <InputValidate name="socialUrl" idleMessage="Доступен только нанятому лицу" successMessage="Отлично" schema={joi.string().allow("")}>
              <input className="w-100 mb-2" placeholder="vk.com/helloitsmedio" />
            </InputValidate>
            <p className="mr-auto my-2">Ваш город</p>
            <InputValidate
              name="city"
              idleMessage="Подбор вакансий по вашему городу"
              successMessage="Отлично"
              schema={joi
                .string()
                .required()
                .error(e => "Необходимое поле")}
            >
              <input className="w-100 mb-2" placeholder="Прага" />
            </InputValidate>
            <p className="mr-auto my-2">Ваши навыки</p>
            <TagInput className="w-100 mb-2" tags={signUp.tags} addTag={addTag} removeTag={removeTag} />
          </InputValidateGroup>
          <button className="btn btn-primary w-100 rounded-0" onClick={this.registration}>
            Завершить регистрацию
          </button>
        </div>
      </div>
    );
  }
}
