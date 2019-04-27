import React from "react";

import { Search as SearchIcon } from "react-feather";

class Search extends React.Component {
  render() {
    return (
      <div className="w-100">
        <input placeholder="Работа в аду" className="w-100 border-bottom border-2 pr-4 mb-0" style={{ outline: "transparent", border: "none" }} />
        <SearchIcon className="text-secondary p-1"  style={{ marginLeft: "-1.5rem", marginTop: "-0.3em" }} />
      </div>
    );
  }
}

export default Search;
