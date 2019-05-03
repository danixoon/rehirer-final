import React from "react";

class Pagination extends React.Component<any> {
  render() {
    return (
      <div {...this.props} className="d-flex">
        <span className="px-2">
          <a href="#" className="text-primary">
            ←
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary active">
            1
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            2
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            3
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            ...
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            56
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            →
          </a>
        </span>
      </div>
    );
  }
}

export default Pagination;