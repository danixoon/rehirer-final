import React from "react";
import Search from "../Search";
import SlideBarTree from "./SlideBarTree";
import SlideBarRange from "./SlideBarRange";

import AddJobModal from "./AddJobModal";
import { connect } from "react-redux";
import { setJobSearch } from "../../store/actions/jobActions";

const modals = {
  addJob: AddJobModal
};

class SideBar extends React.Component<any> {
  state = {
    modal: {
      component: modals.addJob,
      open: false
    }
  };

  setJobSearch = (search: any) => {
    this.props.setJobSearch(search);
  };

  removeTag = (id: number) => {
    const { search } = this.props;
    search.tags.splice(id, 1);
    this.setJobSearch(search);
  };

  addTag = (label: string) => {
    const { search } = this.props;
    search.tags.push(label);
    this.setJobSearch(search);
  };

  onSearchChange = (e: any) => {
    const { search } = this.props;
    search.search = e.target.value;
    this.setJobSearch(search);
  };

  onPriceChange = (min: number, max: number) => {
    const { search } = this.props;
    search.maxPrice = max;
    search.minPrice = min;
    this.setJobSearch(search);
  };

  componentDidUpdate() {
    console.log("updated");
  }

  toggleModal = () => {
    const { modal } = this.state;
    this.setState({ modal: { ...modal, open: !modal.open } });
  };

  render() {
    const { modal } = this.state;
    const { search } = this.props;
    return (
      <div className="shadow-sm p-3 overflow-auto sticky-top bg-white border border-top-0" style={{ zIndex: 4 }}>
        {modal.component ? <modal.component open={modal.open} toggle={this.toggleModal} /> : ""}

        <div className="mb-3">
          <button className="btn btn-primary w-100 rounded-0 mb-3" onClick={this.toggleModal}>
            Предложить вакансию
          </button>
          <Search onChange={this.onSearchChange} value={search.search} />
        </div>
        <SlideBarTree
          placeholder="Введите тег"
          onSubmit={this.addTag}
          items={search.tags.map((item: any, i: number) => ({ label: item, onClick: () => this.removeTag(i) }))}
          header="Теги"
        />

        <SlideBarRange onMinChange={value => this.onPriceChange(value, search.maxPrice)} onMaxChange={value => this.onPriceChange(search.minPrice, value)} label="Цена" />
      </div>
    );
  }
}

const mapDispatchToProps = {
  setJobSearch
};

const mapStateToProps = (state: any) => ({
  search: state.job.entities.search
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
