import React from "react";
import Header from "./components/Header";
import StartPage from "./components/StartPage";
import Footer from "./components/Footer";
import { Switch, Route, Redirect } from "react-router";
import JobListPage from "./components/JobListPage";
import UserProfilePage from "./components/UserProfilePage";
import AuthPage from "./components/AuthPage";
import { connect } from "react-redux";
import { userDataFetch, userProfileFetch, userAccountCheckToken } from "./store/actions/userActions";
// import { userAccountCheckToken } from "./store/actions/userActions
import UserJobList from "./components/UserJobList";
import UserRespondList from "./components/UserRespondList";

// const baseUrl = process.env.PUBLIC_URL;

class App extends React.Component<any> {
  constructor(props: any) {
    super(props);

    const token = sessionStorage.getItem("authToken");
    if (token) this.props.userAccountCheckToken(token);
    // console.log("check");
  }

  componentDidUpdate(prevProps: any) {
    // console.log("what");
    const { user } = this.props;
    if (user.statuses.account === "SUCCESS") {
      if (user.statuses.profile === "IDLE") this.props.userProfileFetch();
      if (user.statuses.data === "IDLE") this.props.userDataFetch();
    }

    // console.log("OH NO");
    // }
  }
  render() {
    const { user } = this.props;
    const accountStatus = user.statuses.account;
    return (
      <div className="app align-items-stretch d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <Switch>
          <Route path="/account/settings" component={accountStatus === "SUCCESS" ? UserProfilePage : AuthRequired("/account/settings")} />
          <Route path="/user/responds" component={accountStatus === "SUCCESS" ? UserRespondList : AuthRequired("/user/responds")} />
          <Route path="/account/auth" component={AuthPage} />
          <Route path="/user/jobs" component={accountStatus === "SUCCESS" ? UserJobList : AuthRequired("/user/jobs")} />
          <Route path="/jobs" component={accountStatus === "SUCCESS" ? JobListPage : AuthRequired("/jobs")} />
          <Route path="/main" component={StartPage} />
          <Route path="*" component={InvalidPage} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

const InvalidPage = () => <Redirect to="/main" />;
const AuthRequired = (redirect: string) => () => <Redirect to={{ pathname: "/account/auth", state: { redirect } }} />;
const ToProfile = () => <Redirect to="/account/settings" />;

const mapDispatchToProps = {
  userProfileFetch,
  userDataFetch,
  userAccountCheckToken
};
const mapStateToProps = (state: any) => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
