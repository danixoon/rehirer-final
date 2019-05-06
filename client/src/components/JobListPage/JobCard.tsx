import React from "react";
import axios from "axios";
import { Spinner } from "reactstrap";

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
  toggleRespondModal: () => void;
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
      .catch(console.log);
  };

  componentWillUnmount() {
    this.cancelToken.cancel("Component unmounted");
  }

  render() {
    const { label, tags, description, authorId, city, timespan, price, toggleRespondModal } = this.props;
    const { author } = this.state;
    const hours = Math.round(timespan / 1000 / 60 / 60);
    return (
      <div className="border rounded container-fluid no-gutters mb-2">
        <div className="row">
          <div className="col-sm-4 col-lg-3 border-bottom-0 border-md-right py-2 order-sm-1 order-2">
            <JobInfo label="Работодатель">{author ? `${author.firstName} ${author.secondName}` : <Spinner size="sm" color="primary" />}</JobInfo>
            <JobInfo label="Город">{city}</JobInfo>
            <JobInfo label="Время выполнения">
              {hours} {"час" + bowHours(hours)}
            </JobInfo>
            <JobInfo label="Предложенная цена">{price}₽</JobInfo>
            <button onClick={toggleRespondModal} className="btn-primary btn w-100 rounded-0">
              Откликнуться
            </button>
          </div>
          <div className="col py-2 order-1">
            <a href="#">
              <h3>{label}</h3>
            </a>
            <div className="d-flex flex-wrap">
              {tags.map((t, i) => (
                <div key={i} className="bg-primary text-light mt-auto p-1 mr-1">
                  {t}
                </div>
              ))}
            </div>
            <hr />
            <span>{description}</span>
          </div>
        </div>
      </div>
    );
  }
}

const bowHours = (hours: number) => {
  const number = hours % 100;
  if (number % 10 >= 5 && (number <= 20 || number % 10 <= 9 || number % 10 === 0)) return "ов";
  if (number % 10 >= 2 && number % 10 <= 4) return "а";
  return "";
};

export default JobCard;
