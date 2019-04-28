import React from "react";

import { User, MessageSquare } from "react-feather";

class UserProfileIcon extends React.Component<any> {
  render() {
    return (
      <div {...this.props} className={`${this.props.className || ""} shadow p-2 rounded-pill`}>
        <MessageSquare />
        {/* 0 сообщений */}
        <User />
      </div>
    );
  }
}

export default UserProfileIcon;
