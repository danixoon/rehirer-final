import React from "react";

import icon from "../../images/icon.png";
import Search from "../Search";

import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { User, Settings, LogOut, LogIn, Briefcase, ThumbsUp } from "react-feather";

import { UncontrolledPopover, PopoverHeader, PopoverBody, Spinner } from "reactstrap";
import { history } from "../../store/store";
import { userAccountLogout } from "../../store/actions/userActions";

class Header extends React.Component<any> {
  render() {
    const { location } = this.props.router;
    const { user } = this.props;

    return (
      <div className="shadow-sm w-100 container-fluid bg-white border-bottom" style={{ zIndex: 3 }}>
        <div className="row" style={{ minHeight: "70px" }}>
          <div className="col-auto order-1 d-none d-md-flex align-items-center">
            <img className="" style={{ objectFit: "contain", maxWidth: "2em" }} src={icon} />
          </div>
          <div className="col col-md-auto order-2 col-12 py-3 p-md-0 d-flex align-items-center justify-content-around justify-content-lg-start">
            <NavItem to="/main" active={location.pathname.startsWith("/main")}>
              Главная
            </NavItem>
            <NavItem to="/jobs" active={location.pathname.startsWith("/jobs")}>
              Вакансии
            </NavItem>
          </div>
          <div className="col-md-2 align-items-center order-sm-3 p-2 order-4" style={{ display: location.pathname === "/jobs" ? "none" : "flex" }}>
            <Search />
          </div>
          <div className="mr-sm-2 col-sm w-100 d-flex order-4 align-items-center justify-items-end justify-content-end  p-2">
            <div id="userContextMenu" className="d-flex align-items-center">
              {location.pathname.startsWith("/account/settings") ? <small className="mr-2">Аккаунт</small> : ""}
              <a className={"mx-auto nav-item text-secondary"}>
                <UserData user={user} />
              </a>
              <button className="btn ml-2 btn-primary rounded-pill p-2 position-relative">
                <User />
                <span className="notification-badge " />
              </button>
            </div>
            <UncontrolledPopover trigger="legacy" placement="bottom" target="userContextMenu">
              {(() => {
                switch (user.statuses.account.auth) {
                  case "SUCCESS":
                    return <AuthPopover logout={this.props.logout} />;
                  case "IDLE":
                    return <GuestPopover />;
                  default:
                    return <LoadingPopover />;
                }
              })()}
            </UncontrolledPopover>
          </div>
        </div>
      </div>
    );
  }
}

const UserData = ({ user }: any) => {
  if (user.statuses.data.fetch === "LOADING") return <Spinner size="sm" color="primary" className="m-auto" />;
  else return <span>{user.statuses.data.fetch === "SUCCESS" ? `${user.entities.data.firstName} ${user.entities.data.secondName}` : "Войдите в аккаунт"}</span>;
};

const AuthPopover = ({ logout }: any) => {
  return (
    <PopoverBody>
      <button onClick={() => history.push("/user/jobs")} className="my-1 w-100 text-dark text-left rounded-0 btn d-block position-relative">
        <Briefcase className="mr-2 text-primary " /> Мои вакансии
        <span className="notification-badge " />
      </button>
      <button onClick={() => history.push("/user/responds")} className="my-1 w-100 text-dark text-left rounded-0 btn d-block position-relative">
        <ThumbsUp className="mr-2 text-primary " /> Мои отклики
        <span className="notification-badge " />
      </button>
      <button onClick={() => history.push("/account/settings")} className="my-1 w-100 text-dark text-left rounded-0 btn d-block">
        <Settings className="mr-2 text-primary" /> Аккаунт
      </button>
      <button onClick={logout} className="my-1 w-100 text-dark text-left rounded-0 btn d-block">
        <LogOut className="mr-2 text-primary" /> Выйти
      </button>
    </PopoverBody>
  );
};

const GuestPopover = () => {
  return (
    <PopoverBody>
      <button onClick={() => history.push("/account/auth")} className="my-1 w-100 text-dark text-left rounded-0 btn d-block">
        <LogIn className="mr-2 text-primary" /> Войти в аккаунт
      </button>
    </PopoverBody>
  );
};

const LoadingPopover = () => (
  <PopoverBody>
    <Spinner className="m-auto" color="primary" />
  </PopoverBody>
);

const NavItem = (props: { active?: boolean; to: string } & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const { children, to, className, style, active } = props;
  return (
    <div>
      <Link to={to} className={`nav-item ${active ? "active" : ""} mx-2 mr-sm-3 mr-md-4 mr-xl-5 mr-0 ${className || ""}`}>
        {children}
      </Link>
    </div>
  );
};

const mapStateToProps = (store: any) => ({
  router: store.router,
  user: store.user
});

const mapDispatchToProps = {
  logout: userAccountLogout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
