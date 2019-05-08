import React from "react";
import { connect } from "react-redux";
import querystring from "query-string";

import { history } from "../../store/store";

// import { fetchUserData } from "../.."
import { Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import { string } from "joi";
import InputCheck from "../ValidateInputField";
import { fetchUserJobs, deleteUserJob } from "../../store/actions/jobActions";
import { fetchUserResponds } from "../../store/actions/respondActions";
import UserJob from "./UserJob";
import { authorsFetch } from "../../store/actions/authorActions";
import SwitchPanelGroup, { SwitchPanel } from "../SwitchPanelGroup";
// import { UserJob } from "./UserJob";

class UserJobList extends React.Component<any> {
  // setPanel = (panel: string) => {
  //   const { location } = this.props.router;
  //   history.push(location.pathname + "?panel=" + panel);
  // };

  componentDidMount() {
    // const panel = this.getPanel();
    // if (panel !== "completed" && panel !== "pending") this.setPanel("pending");

    this.props.fetchUserJobs();
    this.props.fetchUserResponds();
  }

  componentDidUpdate(prevProps: any) {
    const { job, author, user } = this.props;
    if (job.statuses.jobs === "SUCCESS" && prevProps.job.statuses.jobs === "LOADING") {
      this.props.authorsFetch(job.entities.jobs.filter((j: any) => j.authorId === user.entities.account.userId).map((j: any) => j._id));
    }

    // const panel = this.getPanel();
    // if (panel !== "completed" && panel !== "pending") this.setPanel("pending");
  }

  // getPanel = () => {
  //   const { location } = this.props.router;
  //   const params = querystring.parse(location.search);
  //   return params.panel;
  // };

  render() {
    // const panel = this.getPanel();
    const { job } = this.props;

    return (
      <div className="container">
        <div className="row">
          <SwitchPanelGroup>
            <SwitchPanel name="pending" header="Ожидающие">
              {job.statuses.jobs !== "SUCCESS" ? (
                <Spinner color="primary" className="m-auto" />
              ) : (
                // ""
                job.entities.jobs.map((j: any) => (
                  <div key={j._id} className="col-100 border mb-2 w-100">
                    <UserJob {...j} reload={this.props.fetchUserJob} delete={this.props.deleteUserJob} />
                  </div>
                ))
              )}
            </SwitchPanel>
            <SwitchPanel name="completed" header="Выполненные" />
          </SwitchPanelGroup>
          {/* <div
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
          </div> */}
        </div>
        <div className="row" />
      </div>
    );
  }
}

const mapStateToProps = (store: any) => ({
  author: store.author,
  router: store.router,
  job: store.job,
  user: store.user
});

const mapDispatchToProps = {
  fetchUserJobs,
  deleteUserJob,
  fetchUserResponds,
  authorsFetch
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

// export connect
