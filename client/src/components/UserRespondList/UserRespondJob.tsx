import React from "react";
import { bowHours } from "../JobListPage/JobCard";
import axios from "axios";
import { JobSecretModal } from "./JobSecretModal";
export class UserRespondJob extends React.Component<any> {
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
      .catch(() => { });
  };
  componentDidMount() {
    const { job } = this.props;
    if (!this.state.jobSecret)
      this.getJobSecret(job._id);
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
    return (<div className="d-flex flex-column w-100 p-3">
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
              return (<button className="btn btn-secondary rounded-0 ml-auto" onClick={() => this.props.deleteUserRespond(respond._id)}>
                Удалить
                  </button>);
            case "APPROVED":
              return (<button onClick={this.toggleSecretModal} className="btn btn-primary rounded-0 ml-auto">
                Подробнее
                  </button>);
            default:
              return (<button onClick={() => this.props.deleteUserRespond(respond._id)} className="btn btn-danger rounded-0 ml-auto">
                Отменить
                  </button>);
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

    </div>);
  }
}
