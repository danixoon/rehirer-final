import React from "react";
import avatar from "../../images/sticker.webp";
import { Star, Eye, Edit2, Edit, Edit3 } from "react-feather";
import _ from "lodash";
import { CustomInput, FormGroup, Form, Spinner } from "reactstrap";
import Checkbox from "../Checkbox";
import { connect } from "react-redux";

const UserRating = ({ rating, className }: { rating: number; className?: string }) => {
  return (
    <div className={className}>
      <div className="" style={{ clipPath: `inset(0 ${(1 - rating) * 10}rem 0 0)`, width: `${5 * 2}rem` }}>
        {_.range(0, 5).map(v => (
          <Star height="2rem" width="2rem" key={v} className="fill-primary" strokeWidth={0} />
        ))}
      </div>
      <div className="" style={{ marginTop: "-2rem", zIndex: 3, width: `${5 * 2}rem` }}>
        {_.range(0, 5).map(v => (
          <Star height="2rem" width="2rem" key={v} className="text-secondary-transparent" strokeWidth={1} />
        ))}
      </div>
    </div>
  );
};

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
    console.log(this.props.account);
    if (this.props.userData.status !== "SUCCESS" || this.props.profile.status !== "SUCCESS") return <Spinner className="m-auto" color="primary" />;
    const { firstName, secondName, thirdName } = this.props.userData.data;
    const { username, email } = this.props.account.data;
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
          <UserProflieField label="ФИО" value={`${firstName} ${secondName}, ${thirdName}`}>
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="Навыки" value="Курьер | Уборщик | Пулемёт">
            Изменить <Edit3 height="1em" width="1em" />
          </UserProflieField>
          <UserProflieField label="Адрес" value="г. undefined, ул. null, д. NaN">
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
          <UserProflieField label="Тип Аккаунта" value="Работник">
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
  profile: state.user.profile,
  userData: state.user.data,
  account: state.account
});

export default connect(mapStateToProps)(UserProfilePage);
