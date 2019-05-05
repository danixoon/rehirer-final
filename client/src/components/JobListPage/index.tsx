import React from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import JobCard from "./JobCard";
import SideBar from "./SideBar";
import SortPanel from "./SortPanel";
import { connect } from "react-redux";
import AddRespondModal from "./AddRespondModal";

class JobListPage extends React.Component<any> {
  state = {
    respondModal: false
  };

  toggleRespondModal = () => {
    const { respondModal } = this.state;
    this.setState({ respondModal: !respondModal });
  };

  render() {
    const { jobs } = this.props;
    const { respondModal } = this.state;
    return (
      <div className="fluid-container bg-white" style={{ minHeight: "85vh" }}>
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2 col">
            <SideBar />
          </div>
          <div className="col-sm-12 col-md col-lg p-3">
            <div className="container p-0">
              <SortPanel />
              <AddRespondModal open={respondModal} toggle={this.toggleRespondModal} />
              {jobs.map((j: any, i: number) => (
                <JobCard key={i} {...j} toggleRespondModal={this.toggleRespondModal} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  jobs: state.job.jobs
});

export default connect(mapStateToProps)(JobListPage);
