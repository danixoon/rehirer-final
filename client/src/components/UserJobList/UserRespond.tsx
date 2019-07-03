import React from "react";
import { Spinner } from "reactstrap";
import { connect } from "react-redux";
import { changeUserRespondStatus } from "../../store/actions/respondActions";
import UserRating from "../UserRating";

class UserRespond extends React.Component<any> {
  render() {
    const { respond, author } = this.props;
    const { message, _id, status } = respond;
    const user = author.statuses.authors.fetch === "SUCCESS" && author.entities.authors.find((a: any) => a.respondId === _id);
    return (
      <div className="container-fluid p-2">
        <div className="row no-gutters">
          <div className="col-auto pr-2">{user && <img className="rounded-pill" style={{ height: "50px", width: "50px" }} src={user.data.avatarUrl} />}</div>
          <div className="col p-0 d-flex flex-column">
            {user ? (
              <div>
                <p>{`${user.data.firstName} ${user.data.secondName}`}</p>
                <span> {message} </span>
                <div className="d-flex pt-2 flex-wrap">
                  {user.data.tags.map((t: any, i: number) => (
                    <div key={i} className="bg-primary text-light mt-auto p-1 m-1">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Spinner color="primary" />
            )}
          </div>
          <div className="col-md-auto col-100 d-flex flex-column justify-content-end">
            <UserRating className="ml-sm-auto mx-auto" rating={0.8} />
            {(() => {
              switch (status) {
                case "PENDING":
                  return (
                    <div className="d-flex flex-column">
                      <button onClick={() => this.props.changeUserRespondStatus(_id, "DECLINED")} className="btn btn-outline-danger  rounded-0 m-1 mt-0">
                        Отказать
                      </button>
                      <button onClick={() => this.props.changeUserRespondStatus(_id, "APPROVED")} className="btn btn-primary rounded-0 m-1 mb-0 ">
                        Нанять
                      </button>
                    </div>
                  );
                case "DECLINED":
                  return <button className="btn btn-danger w-100 h-100 mt-auto rounded-0 disabled"> Отменено </button>;
                case "APPROVED":
                  return <button className="btn btn-primary w-100 h-100 mt-auto rounded-0 disabled"> Принято </button>;
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = {
  changeUserRespondStatus
};
const mapStateToProps = (state: any) => ({
  author: state.author
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRespond);
