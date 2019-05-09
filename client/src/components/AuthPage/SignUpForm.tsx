import React from "react";
import { ArrowLeft } from "react-feather";
import { TagInput } from "../JobListPage/TagInput";
export class SignUpForm extends React.Component<any> {
  registration = () => {
    this.props.registration();
  };
  render() {
    const { signUp, onChange, status, error, switchForm, addTag, removeTag } = this.props;
    return (<div className="py-3 px-0 overflow-hidden mx-auto container no-gutters row bg-white border border-top-0 border-bottom-0">
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
        <input value={signUp.description} onChange={e => onChange(e, "signUp")} name="description" className="w-100" placeholder="Дружелюбный, люблю животных, часто посещаю субботники" />
        <p className="mr-auto mb-2">Страница соц-сети</p>
        <input value={signUp.socialUrl} onChange={e => onChange(e, "signUp")} name="socialUrl" className="w-100" placeholder="vk.com/helloitsmedio" />
        <p className="mr-auto mb-2">Ваш город</p>
        <input value={signUp.city} onChange={e => onChange(e, "signUp")} name="city" className="w-100" placeholder="Прага" />
        <p className="mr-auto mb-2">Ваши навыки</p>
        <TagInput className="w-100" tags={signUp.tags} addTag={addTag} removeTag={removeTag} />

        <button className="btn btn-primary w-100 rounded-0" onClick={this.registration}>
          Завершить регистрацию
          </button>
      </div>
    </div>);
  }
}
