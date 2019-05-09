import React from "react";
import { connect } from "react-redux";

// import { fetchUserData } from "../.."
import { Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import { fetchUserJobs, deleteUserJob } from "../../store/actions/jobActions";
import { fetchUserResponds } from "../../store/actions/respondActions";
import UserJob from "./UserJob";
import { authorsFetch } from "../../store/actions/authorActions";
import SwitchPanelGroup, { SwitchPanel } from "../SwitchPanelGroup";

class UserJobList extends React.Component<any> {
  componentDidMount() {
    this.props.fetchUserJobs();
    this.props.fetchUserResponds();
  }

  componentDidUpdate(prevProps: any) {
    const { job, user } = this.props;
    if (job.statuses.jobs === "SUCCESS" && prevProps.job.statuses.jobs === "LOADING") {
      this.props.authorsFetch(job.entities.jobs.filter((j: any) => j.authorId === user.entities.account.userId).map((j: any) => j._id));
    }
  }

  render() {
    const { job } = this.props;

    return (
      <div className="container row no-gutters" style={{ minHeight: "85vh" }}>
        <SwitchPanelGroup>
          <SwitchPanel name="pending" header="Ожидающие" className="d-flex flex-column flex-grow-1">
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
