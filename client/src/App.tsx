import React from "react";
import Header from "./components/Header";
import StartPage from "./components/StartPage";
import Footer from "./components/Footer";
import { Switch, Route, Redirect } from "react-router";
import JobListPage from "./components/JobListPage";
import UserProfilePage from "./components/UserProfilePage";
import AuthPage from "./components/AuthPage";
import { connect } from "react-redux";
import { fetchUserProfile, fetchUserData } from "./actions/userActions";
import { accountCheckToken } from "./actions/accountActions";
import UserJobList from "./components/UserJobList";
import UserRespondList from "./components/UserRespondList";

// const baseUrl = process.env.PUBLIC_URL;

class App extends React.Component<any> {
  constructor(props: any) {
    super(props);

    const token = sessionStorage.getItem("authToken");
    if (token) this.props.accountCheckToken(token);
    // console.log("check");
  }

  componentDidUpdate() {
    // console.log("what");
    const { accountStatus, profile, userData } = this.props;
    if (accountStatus === "SUCCESS") {
      if (profile.status === "IDLE") this.props.fetchUserProfile();
      if (userData.status === "IDLE") this.props.fetchUserData();
    }

    // console.log("OH NO");
    // }
  }
  render() {
    const { accountStatus } = this.props;
    return (
      <div className="app align-items-stretch d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <Switch>
          <Route path="/account/settings" component={accountStatus === "SUCCESS" ? UserProfilePage : AuthRequired} />
          <Route path="/user/responds" component={accountStatus === "SUCCESS" ? UserRespondList : AuthPage} />
          <Route path="/account/auth" component={accountStatus === "SUCCESS" ? ToProfile : AuthPage} />
          <Route path="/user/jobs" component={accountStatus === "SUCCESS" ? UserJobList : AuthPage} />
          <Route path="/main" component={StartPage} />
          <Route path="/jobs" component={JobListPage} />
          <Route path="*" component={InvalidPage} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const InvalidPage = () => <Redirect to="/main" />;
const AuthRequired = () => <Redirect to="/account/auth" />;
const ToProfile = () => <Redirect to="/account/settings" />;

const mapDispatchToProps = {
  fetchUserProfile,
  fetchUserData,
  accountCheckToken
};
const mapStateToProps = (state: any) => ({
  accountStatus: state.account.status,
  profile: state.user.profile,
  userData: state.user.data
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
