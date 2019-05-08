import React from "react";
import { connect } from "react-redux";
import querystring from "query-string";

import { history } from "../../store/store";
import { UserRating } from "../UserProfilePage";
// import { fetchUserRespond } from "../../actions/userProfileActions";
import { Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { bowHours } from "../JobListPage/JobCard";
import { fetchUserResponds, deleteUserRespond } from "../../store/actions/respondActions";
import { fetchRespondJobs } from "../../store/actions/jobActions";
// import { deleteRespond, getJobSecret } from "../../actions/jobListActions";

import axios from "axios";

class UserRespondList extends React.Component<any> {
  setPanel = (panel: string) => {
    const { location } = this.props.router;
    history.push(location.pathname + "?panel=" + panel);
  };

  componentDidMount() {
    const panel = this.getPanel();
    if (panel !== "completed" && panel !== "pending") this.setPanel("pending");
    this.props.fetchUserResponds();
  }

  componentDidUpdate(prevProps: any) {
    const panel = this.getPanel();
    if (panel !== "completed" && panel !== "pending") this.setPanel("pending");
    const { job, respond } = this.props;
    if (respond.statuses.responds === "SUCCESS" && prevProps.respond.statuses.responds === "LOADING") {
      this.props.fetchRespondJobs(respond.entities.responds.map((r: any) => r.jobId));
    }
  }

  getPanel = () => {
    const { location } = this.props.router;
    const params = querystring.parse(location.search);
    return params.panel;
  };

  render() {
    // const { location } = this.props.router;
    const panel = this.getPanel();
    const { respond, job } = this.props;

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
            {respond.statuses.responds !== "SUCCESS" || job.statuses.jobs !== "SUCCESS" ? (
              <Spinner color="primary" className="m-auto" />
            ) : (
              respond.entities.responds.map((r: any) => {
                const j = job.entities.jobs.find((j: any) => j._id === r.jobId);
                if (!j) return;
                return (
                  <div key={r._id}>
                    <UserRespondJob respond={r} job={j} deleteUserRespond={this.props.deleteUserRespond} userResponds={respond} />
                    <hr className="w-100 m-0" />
                  </div>
                );
              })
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

export class JobSecretModal extends React.Component<any> {
  render() {
    const { open, toggle, secretData } = this.props;

    return (
      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader>Подробнее</ModalHeader>
        <ModalBody className="d-flex flex-column">
          {secretData ? (
            <div>
              <p>Данные о работе</p>
              <span> {secretData.secretInfo || "Работодатель ничего не сообщил"} </span>
              <p className="mt-2">Связь с работодателем</p>
              <span> {secretData.socialURL || secretData.email} </span>
            </div>
          ) : (
            <Spinner color="primary" className="m-auto" />
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="rounded-0" color="secondary" onClick={toggle}>
            Закрыть
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

class UserRespondJob extends React.Component<any> {
  state = {
    secretModal: false,
    jobSecret: null
  };

  toggleSecretModal = () => {
    const { secretModal } = this.state;
    this.setState({ secretModal: !secretModal });
  };

  cancelToken = axios.CancelToken.source();

  getJobSecret = (jobId: string) => {
    axios
      .get("/api/job/secret", { cancelToken: this.cancelToken.token, params: { jobId }, headers: { "x-auth-token": sessionStorage.getItem("authToken") } })
      .then(s => this.setState({ jobSecret: s.data }))
      .catch(() => {});
  };

  componentDidMount() {
    const { job } = this.props;
    if (!this.state.jobSecret) this.getJobSecret(job._id);
  }

  componentWillUnmount() {
    this.cancelToken.cancel();
  }

  // componentDidUpdate() {
  //   if (this.props.status === "APPROVED" && this.props.secretStatus === "IDLE") this.props.getJobSecret(this.props.job._id);
  // }

  render() {
    const { secretModal, jobSecret } = this.state;
    const { job, respond } = this.props;
    const hours = Math.round(job.timespan / 60 / 60 / 1000);
    return (
      <div className="d-flex flex-column w-100 p-3">
        <JobSecretModal toggle={this.toggleSecretModal} secretData={jobSecret} open={secretModal} />
        <div className="d-flex">
          {(() => {
            switch (respond.status) {
              case "DECLINED":
                return <span className="my-auto text-danger">Отменено</span>;
              case "APPROVED":
                return <span className="my-auto text-success">Вы приняты!</span>;
              default:
                return <span className="my-auto">Ожидается ответ..</span>;
            }
          })()}
          {(() => {
            switch (respond.status) {
              case "DECLINED":
                return (
                  <button className="btn btn-secondary rounded-0 ml-auto" onClick={() => this.props.deleteUserRespond(respond._id)}>
                    Удалить
                  </button>
                );
              case "APPROVED":
                return (
                  <button onClick={this.toggleSecretModal} className="btn btn-primary rounded-0 ml-auto">
                    Работать
                  </button>
                );
              default:
                return (
                  <button onClick={() => this.props.deleteUserRespond(respond._id)} className="btn btn-danger rounded-0 ml-auto">
                    Отменить
                  </button>
                );
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
        <span>{respond.message}</span>
        {/* <hr className="m-0 my-3" /> */}
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetchUserResponds,
  deleteUserRespond,
  fetchRespondJobs
  // fetchJobSecret
};

const mapStateToProps = (store: any) => ({
  router: store.router,
  respond: store.respond,
  job: store.job
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRespondList);
