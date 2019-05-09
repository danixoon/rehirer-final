import React from "react";
import { connect } from "react-redux";
import querystring from "query-string";

import { history } from "../../store/store";

import { Spinner } from "reactstrap";
import { fetchUserResponds, deleteUserRespond } from "../../store/actions/respondActions";
import { fetchRespondJobs } from "../../store/actions/jobActions";
import { UserRespondJob } from "./UserRespondJob";
import SwitchPanelGroup, { SwitchPanel } from "../SwitchPanelGroup";
import UserJob from "../UserJobList/UserJob";

class UserRespondList extends React.Component<any> {
  setPanel = (panel: string) => {
    const { location } = this.props.router;
    history.push(location.pathname + "?panel=" + panel);
  };

  componentDidMount() {
    const panel = this.getPanel();
    if (panel !== "completed" && panel !== "pending") this.setPanel("pending");
    this.props.fetchUserResponds();
  }

  componentDidUpdate(prevProps: any) {
    const panel = this.getPanel();
    if (panel !== "completed" && panel !== "pending") this.setPanel("pending");
    const { job, respond } = this.props;
    if (respond.statuses.responds === "SUCCESS" && prevProps.respond.statuses.responds === "LOADING") {
      this.props.fetchRespondJobs(respond.entities.responds.map((r: any) => r.jobId));
    }
  }

  getPanel = () => {
    const { location } = this.props.router;
    const params = querystring.parse(location.search);
    return params.panel;
  };

  render() {
    const { respond, job } = this.props;

    return (
      <div className="container row no-gutters" style={{ minHeight: "85vh" }}>
        <SwitchPanelGroup>
          <SwitchPanel name="pending" header="Ожидающие" className="d-flex flex-column flex-grow-1">
            {respond.statuses.responds !== "SUCCESS" || job.statuses.jobs !== "SUCCESS" ? (
              <Spinner color="primary" className="m-auto" />
            ) : (
              respond.entities.responds.map((r: any) => {
                const j = job.entities.jobs.find((j: any) => j._id === r.jobId);
                if (!j) return;
                return (
                  <div key={r._id}>
                    <UserRespondJob respond={r} job={j} deleteUserRespond={this.props.deleteUserRespond} userResponds={respond} />
                    <hr className="w-100 m-0" />
                  </div>
                );
              })
            )}
          </SwitchPanel>
          <SwitchPanel name="completed" header="Выполненные" />
        </SwitchPanelGroup>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetchUserResponds,
  deleteUserRespond,
  fetchRespondJobs
  // fetchJobSecret
};

const mapStateToProps = (store: any) => ({
  router: store.router,
  respond: store.respond,
  job: store.job
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRespondList);
