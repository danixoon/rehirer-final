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
import { history } from "./store/store";

import querystring from "query-string";
import axios from "axios";
import { Spinner } from "reactstrap";

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
    if (user.statuses.account.auth === "SUCCESS") {
      if (user.statuses.profile.fetch === "IDLE") this.props.userProfileFetch();
      if (user.statuses.data.fetch === "IDLE") this.props.userDataFetch();
    }

    // console.log("OH NO");
    // }
  }
  render() {
    const { user, router } = this.props;
    const accountStatus = user.statuses.account.auth;
    const { location } = router;
    const path = location.pathname + location.search;
    const query = querystring.parse(location.search);
    return (
      <div className="app align-items-stretch d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <Switch>
          <Route path="/account/settings" component={accountStatus === "SUCCESS" ? UserProfilePage : AuthRequired(path)} />
          <Route path="/account/verify" component={accountStatus === "SUCCESS" ? UserProfilePage : VerifyAccount(query, this.props.userAccountCheckToken)} />
          <Route path="/user/responds" component={accountStatus === "SUCCESS" ? UserRespondList : AuthRequired(path)} />
          <Route path="/account/auth" component={AuthPage} />
          <Route path="/user/jobs" component={accountStatus === "SUCCESS" ? UserJobList : AuthRequired(path)} />
          <Route path="/jobs" component={accountStatus === "SUCCESS" ? JobListPage : AuthRequired(path)} />
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
const VerifyAccount = ({ salt, hash }: any, userAccountCheckToken: any) => () => {
  axios
    .get("/api/account/verify", { params: { salt, hash } })
    .then(res => {
      sessionStorage.setItem("authToken", res.data.token);
      userAccountCheckToken(res.data.token);
    })
    .catch(() => history.push("/account/auth"));
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center flex-column">
      <Spinner color="primary" className="mb-2" />
      <span>Аккаунт проверяется...</span>
    </div>
  );
  // <Redirect to="/account/settings" />;
};

const mapDispatchToProps = {
  userProfileFetch,
  userDataFetch,
  userAccountCheckToken
};
const mapStateToProps = (state: any) => ({
  user: state.user,
  router: state.router
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
