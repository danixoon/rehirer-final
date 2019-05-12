import React from "react";
import Pagination from "./Pagination";
import SortParameter from "./SortParameter";
import { setJobSearch } from "../../store/actions/jobActions";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";
import { bowWord } from "./JobCard";

class SortPanel extends React.Component<any> {
  onChangeLabelSort = (asc: number) => {
    const { search } = this.props;
    search.labelSort = asc;
    this.props.setJobSearch(search);
  };

  onChangePriceSort = (asc: number) => {
    const { search } = this.props;
    search.priceSort = asc;
    this.props.setJobSearch(search);
  };

  render() {
    const { job, search } = this.props;
    return (
      <div className="fluid-container no-gutters">
        <div className="row mb-4">
          <div className="col d-flex justify-content-lg-end justify-content-center">
            <Pagination className="" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-lg-3 col-sm-auto mb-4 mb-sm-0 order-md-1 order-3 d-flex">
            {job.statuses.jobs.fetch !== "SUCCESS" ? (
              <Spinner className="mx-auto" color="primary" size="sm" />
            ) : (
              <span className="mx-auto mx-sm-0">
                {job.entities.jobs.count} результат{bowWord(job.entities.jobs.count)}
              </span>
            )}
          </div>
          <div className="col col-md-auto d-flex order-md-2 order-4">
            <SortParameter value={search.priceSort} onChange={this.onChangePriceSort} label="Цена" className="" />
            {/* <SortParameter value={search.labelSort} onChange={this.onChangeLabelSort} label="Название" className="" /> */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  search: state.job.entities.search,
  job: state.job
});

const mapDispatchToProps = {
  setJobSearch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SortPanel);
