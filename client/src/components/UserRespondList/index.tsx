import React from "react";
import { connect } from "react-redux";
import querystring from "query-string";

import { history } from "../../store";
import { UserRating } from "../UserProfilePage";

class UserRespondList extends React.Component<any> {
  setPanel = (panel: string) => {
    const { location } = this.props.router;
    history.push(location.pathname + "?panel=" + panel);
  };

  componentDidMount() {
    const panel = this.getPanel();
    if (panel !== "completed" && panel !== "pending") this.setPanel("pending");
  }

  componentDidUpdate() {
    const panel = this.getPanel();
    if (panel !== "completed" && panel !== "pending") this.setPanel("pending");
  }

  getPanel = () => {
    const { location } = this.props.router;
    const params = querystring.parse(location.search);
    return params.panel;
  };

  render() {
    // const { location } = this.props.router;
    const panel = this.getPanel();

    return (
      <div className="container border">
        <div className="row">
          <div
            onClick={() => {
              this.setPanel("pending");
            }}
            className={"col d-flex justify-content-center py-2 " + (panel === "pending" ? "bg-primary" : "border-bottom")}
            style={{ cursor: "pointer" }}
          >
            <p className={panel === "pending" ? "text-light" : ""}>Ожидающие</p>
          </div>
          <div
            onClick={() => {
              this.setPanel("completed");
            }}
            className={"col d-flex justify-content-center py-2 " + (panel === "completed" ? "bg-primary" : "border-bottom")}
            style={{ cursor: "pointer" }}
          >
            <p className={panel === "completed" ? "text-light" : ""}>Выполненные</p>
          </div>
        </div>
        <div className="row">
          <div className="col p-0">
            <UserRespondJob status="RESOLVED" />
            <hr className="w-100 m-0" />
            <UserRespondJob status="REJECTED" />
            <hr className="w-100 m-0" />
            <UserRespondJob status="PENDING" />
          </div>
        </div>
      </div>
    );
  }
}

interface IUserRespondJobProps {
  status: "PENDING" | "RESOLVED" | "REJECTED";
  [key: string]: any;
}

class UserRespondJob extends React.Component<IUserRespondJobProps> {
  render() {
    const { status } = this.props;

    return (
      <div className="d-flex flex-column w-100 p-3">
        <div className="d-flex">
          {(() => {
            switch (status) {
              case "REJECTED":
                return <span className="my-auto text-danger">Отменено</span>;
              case "RESOLVED":
                return <span className="my-auto text-success">Вы приняты!</span>;
              default:
                return <span className="my-auto">Ожидается ответ..</span>;
            }
          })()}
          {(() => {
            switch (status) {
              case "REJECTED":
                return <button className="btn btn-secondary rounded-0 ml-auto">Удалить</button>;
              case "RESOLVED":
                return <button className="btn btn-primary rounded-0 ml-auto">Работать</button>;
              default:
                return <button className="btn btn-danger rounded-0 ml-auto">Отменить</button>;
            }
          })()}
        </div>
        <hr className="m-0 my-3" />
        <h3>Выгул собаки</h3>
        <span>Ну корчое у нас тут вё плохо дадада</span>
        <hr className="m-0 my-3" />
        <p>Адрес</p>
        <span className="mb-2">Улица Пушкина Дом Калатушкинааааа</span>
        <p>Время выполнения</p>
        <span className="mb-2">1 час</span>
        <p>Цена</p>
        <span className="mb-2">1000р</span>
        {/* <hr className="m-0 my-3" /> */}
      </div>
    );
  }
}

const mapStateToProps = (store: any) => ({
  router: store.router
});

export default connect(mapStateToProps)(UserRespondList);
