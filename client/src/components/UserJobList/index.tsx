import React from "react";
import { connect } from "react-redux";
import querystring from "query-string";

import { history } from "../../store";
import { UserRating } from "../UserProfilePage";

class UserJobList extends React.Component<any> {
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
    // if (panel !== "completed" && panel !== "pending") this.setPanel("pending");

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
          <div className="col">
            <UserJob />
          </div>
        </div>
      </div>
    );
  }
}

class UserJob extends React.Component<any> {
  render() {
    return (
      <div className="d-flex flex-column py-2 w-100">
        <h3>Выгул собаки</h3>
        <span>Ну корчое у нас тут вё плохо дадада</span>
        <hr className="m-0 my-3" />
        <p>Адрес</p>
        <span className="mb-2">Улица Пушкина Дом Калатушкинааааа</span>
        <p>Время выполнения</p>
        <span className="mb-2">1 час</span>
        <p>Цена</p>
        <span className="mb-2">1000р</span>
        <hr className="m-0 my-3" />
        <p className="mb-3">Отклики</p>
        <div className="container-fluid">
          <div className="row border">
            <UserRespond />
          </div>
          <div className="row border">
            <UserRespond />
          </div>
          <div className="row border">
            <UserRespond />
          </div>
        </div>
      </div>
    );
  }
}

const UserRespond = () => (
  <div className="container-fluid p-2">
    <div className="row no-gutters">
      <div className="col-auto pr-2">
        <img className="rounded-pill" style={{ height: "50px" }} src="https://picsum.photos/200" />
      </div>
      <div className="col p-0 d-flex flex-column">
        <p>Лупа Пупович</p>
        <span> Могу изишно помочь ибо я классный все дела принимай меня точно я пригожусь! </span>
        <div className="d-flex pt-2 flex-wrap">
          <div className="bg-primary text-light mt-auto p-1 m-1"> Уборщик </div>
          <div className="bg-primary text-light mt-auto p-1 m-1"> Гений </div>
          <div className="bg-primary text-light mt-auto p-1 m-1"> Студент </div>
          <div className="bg-primary text-light mt-auto p-1 m-1"> Имбицил </div>
        </div>
      </div>
      <div className="col-md-auto col-100 d-flex flex-column justify-content-end">
        <UserRating className="ml-sm-auto mx-auto" rating={0.8} />
        <button className="btn btn-outline-danger  rounded-0 m-1 mt-0">Отказать</button>
        <button className="btn btn-primary rounded-0 m-1 mb-0 ">Нанять</button>
      </div>
    </div>
  </div>
);

const mapStateToProps = (store: any) => ({
  router: store.router
});

export default connect(mapStateToProps)(UserJobList);
