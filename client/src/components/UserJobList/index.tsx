import React from "react";
import { connect } from "react-redux";
import querystring from "query-string";

import { history } from "../../store";
import { UserRating } from "../UserProfilePage";
import { fetchUserJob, fetchUserData, deleteUserJob } from "../../actions/userActions";
import { Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import axios from "axios";
import { string } from "joi";
import InputCheck from "../ValidateInputField";
import { bowHours } from "../JobListPage/JobCard";
// import { UserJob } from "./UserJob";

class UserJobList extends React.Component<any> {
  setPanel = (panel: string) => {
    const { location } = this.props.router;
    history.push(location.pathname + "?panel=" + panel);
  };

  componentDidMount() {
    const panel = this.getPanel();
    if (panel !== "completed" && panel !== "pending") this.setPanel("pending");

    this.props.fetchUserJob();
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
    const panel = this.getPanel();
    const { job } = this.props;
    return (
      <div className="container">
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
          {job.status !== "SUCCESS" ? (
            <Spinner color="primary" className="m-auto" />
          ) : (
            // ""
            job.data.map((j: any) => (
              <div key={j._id} className="col-100 border mb-2 w-100">
                <UserJob {...j} reload={this.props.fetchUserJob} delete={this.props.deleteUserJob} />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: any) => ({
  router: store.router,
  job: store.user.job
});

const mapDispatchToProps = {
  fetchUserJob,
  deleteUserJob
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserJobList);

export interface IUserJobProps {
  _id: string;
  label: string;
  description: string;
  city: string;
  timespan: number;
  price: number;
  [key: string]: any;
}

class UserJob extends React.Component<any> {
  state = {
    deleteModal: false
  };

  toggleDeleteModal = () => {
    const { deleteModal } = this.state;
    this.setState({ deleteModal: !deleteModal });
  };
  render() {
    const { label, city, timespan, price, description, respond, _id } = this.props;
    const { deleteModal } = this.state;
    const hours = Math.round(timespan / 1000 / 60 / 60);
    return (
      <div className="d-flex flex-column p-3 w-100">
        <AreYouSureModal sure={() => this.props.delete(_id)} open={deleteModal} toggle={this.toggleDeleteModal} />
        <div className="d-flex">
          <h3>{label}</h3>
          <button onClick={this.toggleDeleteModal} className="btn btn-outline-danger rounded-0 ml-auto">
            Удалить
          </button>
        </div>
        <span>{description}</span>
        <hr className="m-0 my-3" />
        <p>Город</p>
        <span className="mb-2">{city}</span>
        <p>Время выполнения</p>
        <span className="mb-2">
          {hours} {"час" + bowHours(hours)}
        </span>
        <p>Цена</p>
        <span className="mb-2">{price}₽</span>
        <p className="mb-2">Отклики</p>
        <div className="container-fluid row no-gutters p-0">
          {/* {status !== "SUCCESS" ? (
            <Spinner color="primary" className="m-auto" />
          ) : responds.length === 0 ? (
            <span>Пока нет</span>
          ) : ( */}
          {respond && respond.map((r: any) => (
            <div key={r._id} className="border-top w-100">
              <UserRespond {...r} />
            </div>
          ))}
          {/* )} */}
        </div>
      </div>
    );
  }
}

export class AreYouSureModal extends React.Component<any> {
  render() {
    const { open, toggle, sure } = this.props;
    return (
      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader>Удаление вакансии</ModalHeader>
        <ModalBody>
          <p>Вы уверены, что хотите удалить?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              sure();
              toggle();
            }}
            className="rounded-0"
            color="primary"
          >
            Удалить
          </Button>
          <Button className="rounded-0" color="secondary" onClick={toggle}>
            Отмена
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export class UserRespond extends React.Component<any> {
  state = {
    status: "IDLE",
    data: null as any
  };

  componentDidMount() {
    this.fetchUserData(this.props.userId);
  }

  fetchUserData = (id: string) => {
    this.setState({ status: "LOADING" });
    axios
      .get("/api/user/data", { params: { userId: id }, headers: { "x-auth-token": sessionStorage.getItem("authToken") } })
      .then(res => this.setState({ data: res.data, status: "SUCCESS" }))
      .catch(err => {
        this.setState({ data: null, status: "ERROR" });
        console.log(err);
      });
  };

  render() {
    const { userId, message } = this.props;
    const { status, data } = this.state;
    return (
      <div className="container-fluid p-2">
        <div className="row no-gutters">
          <div className="col-auto pr-2">
            <img className="rounded-pill" style={{ height: "50px" }} src="https://picsum.photos/200" />
          </div>
          <div className="col p-0 d-flex flex-column">
            {status === "SUCCESS" ? <p>{`${data.firstName} ${data.secondName}`}</p> : <Spinner color="primary" size="sm" />}
            <span> {message} </span>
            <div className="d-flex pt-2 flex-wrap">
              {status === "SUCCESS" ? (
                data.tags.map((t: any, i: number) => (
                  <div key={i} className="bg-primary text-light mt-auto p-1 m-1">
                    {t}
                  </div>
                ))
              ) : (
                <Spinner color="primary" size="sm" />
              )}
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
  }
}
