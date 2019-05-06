import React from "react";
import { connect } from "react-redux";
import querystring from "query-string";

import { history } from "../../store";
import { UserRating } from "../UserProfilePage";
import { fetchUserRespond } from "../../actions/userActions";
import { Spinner } from "reactstrap";
import { bowHours } from "../JobListPage/JobCard";

class UserRespondList extends React.Component<any> {
  setPanel = (panel: string) => {
    const { location } = this.props.router;
    history.push(location.pathname + "?panel=" + panel);
  };

  componentDidMount() {
    const panel = this.getPanel();
    this.props.fetchUserRespond();
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
    const { respond } = this.props;

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
            {respond.status !== "SUCCESS" ? (
              <Spinner color="primary" className="m-auto" />
            ) : (
              respond.data.map((r: any) => (
                <div key={r._id}>
                  <UserRespondJob {...r} />
                  <hr className="w-100 m-0" />
                </div>
              ))
            )}
            {/* <UserRespondJob status="RESOLVED" />
            <hr className="w-100 m-0" />
            <UserRespondJob status="REJECTED" />
            <hr className="w-100 m-0" />
            <UserRespondJob status="PENDING" /> */}
          </div>
        </div>
      </div>
    );
  }
}

class UserRespondJob extends React.Component<any> {
  render() {
    const { status, job, message, author } = this.props;
    const hours = Math.round(job.timespan / 60 / 60 / 1000);
    return (
      <div className="d-flex flex-column w-100 p-3">
        <div className="d-flex">
          {(() => {
            switch (status) {
              case "DECLINED":
                return <span className="my-auto text-danger">Отменено</span>;
              case "APPROVED":
                return <span className="my-auto text-success">Вы приняты!</span>;
              default:
                return <span className="my-auto">Ожидается ответ..</span>;
            }
          })()}
          {(() => {
            switch (status) {
              case "DECLINED":
                return <button className="btn btn-secondary rounded-0 ml-auto">Удалить</button>;
              case "APPROVED":
                return <button className="btn btn-primary rounded-0 ml-auto">Работать</button>;
              default:
                return <button className="btn btn-danger rounded-0 ml-auto">Отменить</button>;
            }
          })()}
        </div>
        <hr className="m-0 my-3" />
        <h3>{job.label}</h3>
        <span>{job.description}</span>
        <hr className="m-0 my-3" />
        <p>Город</p>
        <span className="mb-2">{job.city}</span>
        <p>Время выполнения</p>
        <span className="mb-2">
          {hours} {"час" + bowHours(hours)}
        </span>
        <p>Цена</p>
        <span className="mb-2">{job.price}₽</span>
        <hr className="m-0 my-3" />
        <p>Ваше сообщение работодателю</p>
        <span>{message}</span>
        {/* <hr className="m-0 my-3" /> */}
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetchUserRespond
};

const mapStateToProps = (store: any) => ({
  router: store.router,
  respond: store.user.respond
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRespondList);
