import React from "react";
import Header from "./components/Header";
import StartPage from "./components/StartPage";
import Footer from "./components/Footer";
import { Switch, Route, Redirect } from "react-router";
import JobListPage from "./components/JobListPage";
import UserProfilePage from "./components/UserProfilePage";
import AuthPage from "./components/AuthPage";
import { connect } from "react-redux";
import { fetchUserProfile } from "./actions/userReducer";

// const baseUrl = process.env.PUBLIC_URL;

class App extends React.Component<any> {
  componentDidUpdate() {
    const { accountStatus } = this.props;
    if (accountStatus === "SUCCESS") this.props.fetchProfile();
    // console.log("OH NO");
    // }
  }
  render() {
    return (
      <div className="app align-items-stretch d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <Switch>
          <Route path="/account/settings" component={UserProfilePage} />
          <Route path="/account/auth" component={AuthPage} />
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

const mapDispatchToProps = {
  fetchProfile: fetchUserProfile
};
const mapStateToProps = (state: any) => ({
  accountStatus: state.account.status
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
