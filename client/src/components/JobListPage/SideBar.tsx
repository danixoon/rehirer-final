import React from "react";
import Search from "../Search";
import SlideBarTree from "./SlideBarTree";
import SlideBarRange from "./SlideBarRange";

import AddJobModal from "./AddJobModal";

const modals = {
  addJob: AddJobModal
};

class SideBar extends React.Component {
  state = {
    items: ["Уборка"],
    modal: {
      component: modals.addJob,
      open: false
    }
  };

  removeItem = (id: number) => {
    const { items } = this.state;
    items.splice(id, 1);
    this.setState({ items });
  };

  addItem = (label: string) => {
    this.setState({ items: [...this.state.items, label] });
  };

  toggleModal = () => {
    const { modal } = this.state;
    this.setState({ modal: { ...modal, open: !modal.open } });
  };

  render() {
    const { items, modal } = this.state;
    return (
      <div className="shadow-sm p-3 overflow-auto sticky-top bg-white border border-top-0" style={{ zIndex: 4 }}>
        {modal.component ? <modal.component open={modal.open} toggle={this.toggleModal} /> : ""}

        <div className="mb-3">
          <button className="btn btn-primary w-100 rounded-0 mb-3" onClick={this.toggleModal}>
            Предложить вакансию
          </button>
          <Search />
        </div>
        <SlideBarTree placeholder="Введите тег" onSubmit={this.addItem} items={items.map((item, i) => ({ label: item, onClick: () => this.removeItem(i) }))} header="Теги" />

        <SlideBarRange label="Цена" />
      </div>
    );
  }
}

export default SideBar;
