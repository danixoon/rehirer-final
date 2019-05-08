import React from "react";
import { bowHours } from "../JobListPage/JobCard";
import UserRespond from "./UserRespond";
import { AreYouSureModal } from "./index";
import { connect } from "react-redux";
class UserJob extends React.Component<any> {
  state = {
    deleteModal: false
  };
  toggleDeleteModal = () => {
    const { deleteModal } = this.state;
    this.setState({ deleteModal: !deleteModal });
  };
  render() {
    const { label, city, timespan, price, description, _id, author, respond } = this.props;
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
          {respond.statuses.responds === "SUCCESS" &&
            author.statuses.authors === "SUCCESS" &&
            respond.entities.responds
              .filter((r: any) => r.jobId === _id)
              .map((r: any) => (
                <div key={r._id} className="border-top w-100">
                  <UserRespond respond={r} />
                </div>
              ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  respond: state.respond,
  author: state.author
});

export default connect(mapStateToProps)(UserJob);
