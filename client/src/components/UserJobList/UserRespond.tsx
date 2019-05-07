import React from "react";
import { UserRating } from "../UserProfilePage";
import { Spinner } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import { changeRespondStatus } from "../../actions/jobActions";

class UserRespond extends React.Component<any> {
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
    const { userId, message, _id, status: respondStatus, author } = this.props;
    // const { status, data } = this.state;
    const status = "SUCCESS";
    console.log("YEAH");
    return (
      <div className="container-fluid p-2">
        <div className="row no-gutters">
          <div className="col-auto pr-2">
            <img className="rounded-pill" style={{ height: "50px" }} src="https://picsum.photos/200" />
          </div>
          <div className="col p-0 d-flex flex-column">
            {status === "SUCCESS" ? <p>{`${author.firstName} ${author.secondName}`}</p> : <Spinner color="primary" size="sm" />}
            <span> {message} </span>
            <div className="d-flex pt-2 flex-wrap">
              {status === "SUCCESS" ? (
                author.tags.map((t: any, i: number) => (
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
            {(() => {
              switch (respondStatus) {
                case "PENDING":
                  return (
                    <div className="d-flex flex-column">
                      <button onClick={() => this.props.changeRespondStatus(_id, "DECLINED")} className="btn btn-outline-danger  rounded-0 m-1 mt-0">
                        Отказать
                      </button>
                      <button onClick={() => this.props.changeRespondStatus(_id, "APPROVED")} className="btn btn-primary rounded-0 m-1 mb-0 ">
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
  changeRespondStatus
};

const mapStateToProps = (state: any) => ({
  respond: state.job.job.respond
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRespond);
