import React from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import JobCard from "./JobCard";
import SideBar from "./SideBar";
import SortPanel from "./SortPanel";
import { connect } from "react-redux";
import AddRespondModal from "./AddRespondModal";

import { fetchJobList, setJobSearch } from "../../store/actions/jobActions";

class JobListPage extends React.Component<any> {
  state = {
    respondModal: false,
    jobId: null
  };

  toggleRespondModal = (jobId: string) => {
    const { respondModal } = this.state;
    if (respondModal === true) (jobId as any) = null;
    this.setState({ respondModal: !respondModal, jobId });
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.job.entities.search !== this.props.job.entities.search) this.props.fetchJobList(this.props.job.entities.search);
  }
  componentDidMount() {
    this.props.setJobSearch(this.props.job.entities.search);
    this.props.fetchJobList(this.props.job.entities.search);
  }

  render() {
    const { job } = this.props;
    const { respondModal, jobId } = this.state;
    return (
      <div className="fluid-container bg-white" style={{ minHeight: "85vh" }}>
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2 col">
            <SideBar />
          </div>
          <div className="col-sm-12 col-md col-lg p-3">
            <div className="container d-flex flex-column p-0">
              <SortPanel />
              <AddRespondModal jobId={jobId} open={respondModal} toggle={this.toggleRespondModal} />
              {job.statuses.jobs.fetch === "SUCCESS" ? (
                job.entities.jobs.items.map((j: any, i: number) => <JobCard key={i} job={j} toggleRespondModal={this.toggleRespondModal} />)
              ) : (
                <Spinner color="primary" className="m-auto" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  job: state.job
});

const mapDispatchToProps = {
  fetchJobList,
  setJobSearch
  // fetchUserResponds
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobListPage);
