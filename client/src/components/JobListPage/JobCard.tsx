import React from "react";
import axios from "axios";
import { Spinner } from "reactstrap";
import { connect } from "react-redux";
import { deleteUserRespond, fetchUserResponds } from "../../store/actions/respondActions";

const JobInfo = (props: { label: string } & any) => (
  <div className="mb-2">
    <p>{props.label}</p>
    <a href="#">
      <span>{props.children}</span>
    </a>
  </div>
);

interface IJobCardProps {
  _id: string;
  label: string;
  tags: string[];
  description: string;
  authorId: string;
  city: number;
  timespan: number;
  price: number;
  respond: any;
  toggleRespondModal: (_id: string) => void;
  [key: string]: any;
}

class JobCard extends React.Component<IJobCardProps> {
  state = {
    author: null as any
  };

  cancelToken = axios.CancelToken.source();

  constructor(props: IJobCardProps) {
    super(props);
    this.fetchUserData(props.authorId);
  }

  fetchUserData = (id: string) => {
    axios
      .get("/api/user/data", { cancelToken: this.cancelToken.token, params: { userId: id }, headers: { "x-auth-token": sessionStorage.getItem("authToken") } })
      .then(res => this.setState({ author: res.data }))
      .catch(() => {});
  };

  componentWillUnmount() {
    this.cancelToken.cancel("Component unmounted");
  }

  componentDidUpdate() {
    const { respond } = this.props;
    if (respond.statuses.responds.fetch === "IDLE" && respond.statuses.responds.fetch !== "LOADING") this.props.fetchUserResponds();
  }

  render() {
    const { respond, job } = this.props;
    const { author } = this.state;
    const hours = Math.round(job.timespan / 1000 / 60 / 60);

    const res = respond.statuses.responds.fetch === "SUCCESS" && respond.entities.responds.find((r: any) => r.jobId === job._id);

    return (
      <div className="border rounded container-fluid no-gutters mb-2">
        <div className="row">
          <div className="col-sm-4 col-lg-3 border-bottom-0 border-md-right py-2 order-sm-1 order-2 d-flex flex-column">
            <JobInfo label="Работодатель">{author ? `${author.firstName} ${author.secondName}` : <Spinner size="sm" color="primary" />}</JobInfo>
            <JobInfo label="Город">{job.city}</JobInfo>
            <JobInfo label="Время выполнения">
              {hours} {"час" + bowHours(hours)}
            </JobInfo>
            <JobInfo label="Предложенная цена">{job.price}₽</JobInfo>
            {respond.statuses.responds.fetch === "SUCCESS" ? (
              <button
                onClick={!res ? () => this.props.toggleRespondModal(job._id) : () => this.props.deleteUserRespond(res._id)}
                className={"btn w-100 rounded-0 " + (!res ? "btn-primary" : "btn-danger")}
              >
                {!res ? "Откликнуться" : "Отменить отклик"}
              </button>
            ) : (
              <Spinner color="primary" className="m-auto" />
            )}
          </div>
          <div className="col py-2 order-1">
            <a href="#">
              <h3>{job.label}</h3>
            </a>
            <div className="d-flex flex-wrap">
              {job.tags &&
                job.tags.map((t: any, i: number) => (
                  <div key={i} className="bg-primary text-light mt-auto p-1 mr-1">
                    {t}
                  </div>
                ))}
            </div>
            <hr />
            <span>{job.description}</span>
          </div>
        </div>
      </div>
    );
  }
}

export const bowHours = (hours: number) => {
  const number = hours % 100;
  if (number % 10 >= 5 && (number <= 20 || number % 10 <= 9 || number % 10 === 0)) return "ов";
  if (number % 10 >= 2 && number % 10 <= 4) return "а";
  return "";
};

const mapDispatchToProps = {
  deleteUserRespond,
  fetchUserResponds
};

const mapStateToProps = (state: any) => ({
  respond: state.respond
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobCard);
