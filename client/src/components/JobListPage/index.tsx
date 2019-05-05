import React from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import JobCard from "./JobCard";
import SideBar from "./SideBar";
import SortPanel from "./SortPanel";
import { connect } from "react-redux";
import AddRespondModal from "./AddRespondModal";

import { fetchJobs } from "../../actions/jobActions";

class JobListPage extends React.Component<any> {
  state = {
    respondModal: false
  };

  toggleRespondModal = () => {
    const { respondModal } = this.state;
    this.setState({ respondModal: !respondModal });
  };

  componentDidMount() {
    this.props.fetchJobs();
  }

  render() {
    const { job } = this.props;
    const { respondModal } = this.state;
    return (
      <div className="fluid-container bg-white" style={{ minHeight: "85vh" }}>
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2 col">
            <SideBar />
          </div>
          <div className="col-sm-12 col-md col-lg p-3">
            <div className="container d-flex flex-column p-0">
              <SortPanel />
              <AddRespondModal open={respondModal} toggle={this.toggleRespondModal} />
              {job.status === "SUCCESS" ? job.data.map((j: any, i: number) => <JobCard key={i} {...j} toggleRespondModal={this.toggleRespondModal} />) : <Spinner color="primary" className="m-auto" />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  job: state.job.job
});

const mapDispatchToProps = {
  fetchJobs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobListPage);
