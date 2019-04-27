import React from "react";

import { User } from "react-feather";

class UserProfileIcon extends React.Component<any> {
  render() {
    return (
      <div {...this.props} className={`${this.props.className || ""} shadow p-2 rounded-pill`}>
        <User />
      </div>
    );
  }
}

export default UserProfileIcon;
