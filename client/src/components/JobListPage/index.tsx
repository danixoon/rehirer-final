import React from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import JobCard from "./JobCard";
import SideBar from "./SideBar";
import SortPanel from "./SortPanel";
import { connect } from "react-redux";

class JobListPage extends React.Component<any> {
  render() {
    const { jobs } = this.props;
    return (
      <div className="fluid-container bg-white" style={{ minHeight: "85vh" }}>
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2 col">
            <SideBar />
          </div>
          <div className="col-sm-12 col-md col-lg p-3">
            <div className="container p-0">
              <SortPanel />

              {jobs.map((j: any, i: number) => (
                <JobCard key={i} {...j} />
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
