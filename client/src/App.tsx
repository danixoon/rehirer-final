import React from "react";
import Header from "./components/Header";
import StartPage from "./components/StartPage";
import Footer from "./components/Footer";
import { Switch, Route, Redirect } from "react-router";
import JobListPage from "./components/JobListPage";

// const baseUrl = process.env.PUBLIC_URL;

const App: React.FC = () => {
  return (
    <div className="app align-items-stretch d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Header />
      <Switch>
        <Route path="/main" component={StartPage} />
        <Route path="/jobs" component={JobListPage} />
        <Route path="*" component={InvalidPage} />
      </Switch>
      <Footer />
    </div>
  );
};

const InvalidPage = () => <Redirect to="/main" />;

export default App;
