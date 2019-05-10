import React from "react";
import avatar from "../../images/sticker.webp";
import { Star, Eye, Edit2, Edit, Edit3 } from "react-feather";
import _ from "lodash";
import { CustomInput, FormGroup, Form, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Checkbox from "../Checkbox";
import { connect } from "react-redux";
import UserRating from "../UserRating";
import { InputValidateGroup, InputValidate } from "../ValidateInputField";
import joi from "joi";
import { userDataModify } from "../../store/actions/userActions";
import { signUpExtend } from "../AuthPage/SignUpForm";
import { TagInput } from "../JobListPage/TagInput";

class EditFieldModal extends React.Component<any> {
  render() {
    const { open, toggle, submit, label, children } = this.props;
    return (
      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader>Изменение</ModalHeader>
        <ModalBody>
          <p>{label}</p>
          {children}
        </ModalBody>
        <ModalFooter>
          <Button onClick={submit} className="rounded-0" color="primary">
            Изменить
          </Button>
          <Button className="rounded-0" color="secondary" onClick={toggle}>
            Отмена
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const UserProflieField = ({ label, value, onAction, children, name, schema }: { schema: any; name: string; label: string; value: string; onAction?: () => void } & any) => (
  <div>
    <div className="d-flex mt-2">
      <p className="mr-2">{label}</p>
      {children ? (
        <a onClick={() => onAction(name, label, schema)}>
          <small className="d-inline-block w-100 text-primary">{children}</small>
        </a>
      ) : (
        ""
      )}
    </div>
    <span className="mt-1">{value}</span>
  </div>
);

class UserProfilePage extends React.Component<any> {
  state = {
    modal: {
      input: {
        cursachSuccess: true
        // tags: []
      } as any,
      open: false,
      label: "",
      prop: "",
      schema: joi.string(),
      forceValidate: false,
      submitted: false
    }
  };

  toggleCheckbox = (e: any) => {
    const { modal } = this.state;
    modal.input[e.target.id] = e.target.checked;
    this.setState({ modal });
  };

  toggleEditFieldModal = (field?: string, label?: string, schema?: any) => {
    const { modal } = this.state;
    const { modify } = this.props.user.statuses.data;
    if (modal.open && modify === "LOADING") return;
    modal.prop = field || "";
    modal.label = label || "";
    modal.schema = schema || joi.string();
    modal.open = !modal.open;
    this.setState({ modal });
  };

  validated = (correct: boolean, value: any) => {
    const { modal } = this.state;
    if (correct) this.setState({ modal: { ...modal, input: { ...modal.input, ...value } } });
    else if (!modal.forceValidate) this.setState({ modal: { ...modal, forceValidate: true } });
  };

  componentDidMount() {
    const { modal } = this.state;
    const { tags } = this.props.user.entities.data;
    modal.input.tags = tags;
    this.setState({ modal });
  }

  componentDidUpdate() {
    const { modify, fetch } = this.props.user.statuses.data;
    const { modal } = this.state;
    if (modal.open && modal.submitted && modify !== "LOADING") {
      modal.submitted = false;
      this.setState(modal);
      this.toggleEditFieldModal();
    }
    if (!modal.input.tags && fetch === "SUCCESS") {
      modal.input.tags = this.props.user.entities.data.tags;
      this.setState(modal);
    }
  }

  modifyFields = () => {
    const { modal } = this.state;
    const [firstName = undefined, secondName = undefined, thirdName = undefined] = (modal.input.fullname && modal.input.fullname.split(/\s+/)) || [];
    this.props.modifyUserData({ ...modal.input, firstName, secondName, thirdName });
    modal.submitted = true;
    this.setState({ modal });
  };

  addTag = (tag: string) => {
    const { modal } = this.state;
    modal.input.tags.push(tag);
    this.setState({ modal });
  };

  removeTag = (tag: string) => {
    const { modal } = this.state;
    modal.input.tags = modal.input.tags.filter((t: any) => t !== tag);
    this.setState({ modal });
  };

  renderModalContent = () => {
    const { input, forceValidate, label, open, prop, schema } = this.state.modal;
    const { modify } = this.props.user.statuses.data;
    if (modify === "LOADING") return <Spinner color="primary" className="m-auto" />;

    switch (prop) {
      case "tags":
        return <TagInput tags={input.tags} addTag={this.addTag} removeTag={this.removeTag} />;
      default:
        return (
          <InputValidateGroup forceValidate={forceValidate} validated={this.validated}>
            <InputValidate name={prop} schema={schema}>
              <input className="w-100" />
            </InputValidate>
          </InputValidateGroup>
        );
    }
  };

  render() {
    const { input, forceValidate, label, open, prop, schema } = this.state.modal;
    const { user } = this.props;
    // console.log(this.props.account);
    if (user.statuses.data.fetch !== "SUCCESS" || user.statuses.profile.fetch !== "SUCCESS") return <Spinner className="m-auto" color="primary" />;
    let { firstName, secondName, thirdName, city, socialUrl, tags, description, dob } = user.entities.data;
    dob = new Date(dob);
    let day = dob.getDate().toString();
    if (day.length === 1) day = "0" + day;
    let month = dob.getUTCMonth().toString();
    if (month.length === 1) month = month === "0" ? "01" : "0" + month;
    // const { firstName, secondName, thirdName, city, socialURL } = user.entities.data;
    const { username, email } = user.entities.account;
    return (
      <div className="container row no-gutters mx-auto border border-top-0 bg-white" style={{ minHeight: "85vh", zIndex: 5 }}>
        <EditFieldModal open={open} label={label} submit={this.modifyFields} toggle={this.toggleEditFieldModal}>
          {this.renderModalContent()}
        </EditFieldModal>
        <div className="col-md-4 col-md-auto">
          <img className="w-100" src={avatar} />
          <button className="btn border-primary text-primary w-100 mt-1 rounded-0">Сменить изображение</button>
          <div className="mt-2">
            <p className="mb-0">Рейтинг</p> <UserRating className="mr-auto" rating={0.5} />
          </div>
          <UserProflieField onAction={this.toggleEditFieldModal} label="Зарегистрирован" value="19.01.19" />
          <UserProflieField onAction={this.toggleEditFieldModal} label="Отзывов" value="33">
            Просмотреть <Eye height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField onAction={this.toggleEditFieldModal} label="Выполнено работ" value="11">
            Просмотреть <Eye height="1em" width="1em" />
          </UserProflieField>
          <hr className="d-md-none" />
        </div>

        <div className="col-md-4 col-100">
          <UserProflieField
            schema={signUpExtend
              .signUp()
              .fullname()
              .error(() => "Неккоректное поле")}
            name="fullname"
            onAction={this.toggleEditFieldModal}
            label="ФИО"
            value={`${secondName} ${firstName} ${thirdName || ""}`}
          >
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField name="tags" onAction={this.toggleEditFieldModal} label="Навыки" value={tags.join(" | ")}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField name="city" onAction={this.toggleEditFieldModal} label="Город" value={city}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField
            schema={signUpExtend
              .signUp()
              .date()
              .error(() => "Неккоректная дата")}
            name="dob"
            onAction={this.toggleEditFieldModal}
            label="Дата рождения"
            value={`${day}.${month}.${dob.getFullYear()}`}
          >
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField name="description" onAction={this.toggleEditFieldModal} label="О вас" value={description}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <hr className="d-md-none" />
        </div>
        <div className="col-md-4 col-100">
          <UserProflieField onAction={this.toggleEditFieldModal} label="Логин" value={username}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField onAction={this.toggleEditFieldModal} label="Почта" value={email}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField onAction={this.toggleEditFieldModal} label="Пароль" value="*******">
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField name="socialUrl" onAction={this.toggleEditFieldModal} label="Связь" value={socialUrl}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>

          <Checkbox className="my-2" id="cursachSuccess" label="Сдать курсач" checked={input.cursachSuccess} toggle={this.toggleCheckbox} />

          <hr className="d-md-none" />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  modifyUserData: userDataModify
};

const mapStateToProps = (state: any) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfilePage);
