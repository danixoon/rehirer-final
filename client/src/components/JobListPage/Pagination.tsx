import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { setJobSearch } from "../../store/actions/jobActions";
import { Spinner } from "reactstrap";

class Pagination extends React.Component<any> {
  renderButtonContent = (v: number, start: number, end: number) => {
    if (v < start) return "←";
    if (v >= end) return "→";
    else return v + 1;
  };

  componentDidUpdate(prevProps: any) {
    const { search, job } = this.props;
    if (job.entities.jobs.count !== prevProps.job.entities.jobs.count) {
      const max = Math.ceil(job.entities.jobs.count / search.maxOnPage);
      if(search.page > max) search.page = max - 1;
      else if(search.page < 0) search.page = 0;
      this.props.setJobSearch(search);
    }
  }

  setPage = (page: number, start: number, end: number, max: number) => {
    const { search } = this.props;
    if (page >= end || page < start) {
      const sign = Math.sign(page - search.page);
      if (sign > 0 && search.page === max - 1) return;
      if (sign < 0 && search.page === 0) return;
      page = search.page + sign;
    }
    search.page = page;
    this.props.setJobSearch(search);
  };

  render() {
    const { search, job } = this.props;
    // let start = search.page - 3;
    // start = start < 0 ? 1 : start;
    // let end = (search.total - search.page * search.maxOnPage) / search.maxOnPage;
    // end = end > 3 ?
    if (job.statuses.jobs.fetch === "IDLE") return <Spinner color="primary" />;
    const max = Math.ceil(job.entities.jobs.count / search.maxOnPage);
    let start = search.page - 3;
    let end = search.page + 3;
    start = start < 0 ? 0 : start;
    end = end > max ? max : end;
    return (
      <div className="d-flex">
        {_.range(start - 1, end + 1).map(v => (
          <button key={v} onClick={() => this.setPage(v, start, end, max)} className={`btn p-1 px-2 rounded-0 ${v === search.page ? "btn-primary" : "text-secondary"}`}>
            {this.renderButtonContent(v, start, end)}
          </button>
        ))}
        {/* 
        <button className="btn p-1 px-2 rounded-0 btn-primary">1</button>
        <button className="btn p-1 px-2 rounded-0 text-secondary">2</button>

        <button className="btn p-1 px-2 rounded-0 text-secondary">3</button>

        <button className="btn p-1 px-2 rounded-0 text-secondary">...</button>

        <button className="btn p-1 px-2 rounded-0 text-secondary">56</button>

        <button className="btn p-1 px-2 rounded-0 text-secondary">→</button> */}
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
)(Pagination);
