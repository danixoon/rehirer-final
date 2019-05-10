import React from "react";
import avatar from "../../images/sticker.webp";
import { Star, Eye, Edit2, Edit, Edit3 } from "react-feather";
import _ from "lodash";
import { CustomInput, FormGroup, Form, Spinner } from "reactstrap";
import Checkbox from "../Checkbox";
import { connect } from "react-redux";
import UserRating from "../UserRating";

const UserProflieField = ({ label, value, onAction, children }: { label: string; value: string; onAction?: () => void } & any) => (
  <div>
    <div className="d-flex mt-2">
      <p className="mr-2">{label}</p>
      {children ? (
        <a onClick={onAction}>
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
    input: {
      cursachSuccess: true
    }
  };

  onChange = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.id]: e.target.value } });
  };

  toggleCheckbox = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.id]: e.target.checked } });
  };

  render() {
    const { cursachSuccess } = this.state.input;
    const { user } = this.props;
    // console.log(this.props.account);
    if (user.statuses.data !== "SUCCESS" || user.statuses.profile !== "SUCCESS") return <Spinner className="m-auto" color="primary" />;
    const { firstName, secondName, thirdName, city, socialUrl, tags, description } = user.entities.data;
    // const { firstName, secondName, thirdName, city, socialURL } = user.entities.data;
    const { username, email } = user.entities.account;
    return (
      <div className="container row no-gutters mx-auto border border-top-0 bg-white" style={{ minHeight: "80vh", zIndex: 5 }}>
        <div className="col-md-4 col-md-auto">
          <img className="w-100" src={avatar} />
          <button className="btn border-primary text-primary w-100 mt-1 rounded-0">Сменить изображение</button>
          <div className="mt-2">
            <p className="mb-0">Рейтинг</p> <UserRating className="mr-auto" rating={0.5} />
          </div>
          <UserProflieField label="Зарегистрирован" value="19.01.19" />
          <UserProflieField onAction={() => alert("wow")} label="Отзывов" value="33">
            Просмотреть <Eye height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField onAction={() => alert("wow")} label="Выполнено работ" value="11">
            Просмотреть <Eye height="1em" width="1em" />
          </UserProflieField>
          <hr className="d-md-none" />
        </div>

        <div className="col-md-4 col-100">
          <UserProflieField label="ФИО" value={`${secondName} ${firstName} ${thirdName || ""}`}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="Навыки" value={tags.join(" | ")}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="Город" value={city}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="О вас" value={description}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <hr className="d-md-none" />
        </div>
        <div className="col-md-4 col-100">
          <UserProflieField label="Логин" value={username}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="Почта" value={email}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="Пароль" value="*******">
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="Связь" value={socialUrl}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>

          <Checkbox className="my-2" id="cursachSuccess" label="Сдать курсач" checked={cursachSuccess} toggle={this.toggleCheckbox} />

          <hr className="d-md-none" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
});

export default connect(mapStateToProps)(UserProfilePage);
