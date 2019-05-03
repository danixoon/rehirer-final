import React from "react";
import Pagination from "./Pagination";
import SortParameter from "./SortParameter";

class SortPanel extends React.Component {
  render() {
    return (
      <div className="fluid-container no-gutters">
        <div className="row mb-4">
          <div className="col d-flex justify-content-lg-end justify-content-center">
            <Pagination className="" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-lg-3 col-sm-auto mb-4 mb-sm-0 order-md-1 order-3 d-flex">
            <span className="mx-auto mx-sm-0">100 результатов</span>
          </div>
          <div className="col col-md-auto d-flex order-md-2 order-4">
            <SortParameter label="Цена" className="" />
            <SortParameter label="Название" className="" />
          </div>
        </div>
      </div>
    );
  }
}

export default SortPanel;