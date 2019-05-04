import React from "react";

import icon from "../../images/icon.png";
import Search from "../Search";
import UserProfileIcon from "../UserProfileIcon";

import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { MessageSquare, User, Settings, LogOut, LogIn } from "react-feather";

import { Manager, Popper, Reference } from "react-popper";

import { UncontrolledPopover, PopoverHeader, PopoverBody, Spinner } from "reactstrap";
import { history } from "../../store";
import { accountLogout } from "../../actions/accountActions";

class Header extends React.Component<any> {
  render() {
    const { location } = this.props.router;
    const { userData, accountStatus, logout } = this.props;
    // console.log(location);
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
            {/* </Link> */}
            {/* <Link to="/jobs"> */}
            <NavItem to="/jobs" active={location.pathname.startsWith("/jobs")}>
              Вакансии
            </NavItem>
            {/* </Link> */}
            <NavItem to="/main"> Анкеты </NavItem>
          </div>
          <div className="col-md-2 align-items-center order-sm-3 p-2 order-4" style={{ display: location.pathname === "/jobs" ? "none" : "flex" }}>
            <Search />
          </div>
          <div className="mr-sm-2 col-sm w-100 d-flex order-4 align-items-center justify-items-end justify-content-end  p-2">
            <div id="userContextMenu" className="d-flex align-items-center">
              {/* <button className="btn btn-primary rounded-pill p-2 d-flex"><MessageSquare /></button> */}
              {location.pathname.startsWith("/account/settings") ? <small className="mr-2">Аккаунт</small> : ""}
              <a className={"mx-auto nav-item text-secondary"}>
                <UserData userData={userData} />
              </a>
              <button className="btn ml-2 btn-primary rounded-pill p-2 position-relative">
                <User />
                {/* <div> */}
                <span className="notification-badge " />
                {/* </div> */}
              </button>
            </div>
            <UncontrolledPopover trigger="legacy" placement="bottom" target="userContextMenu">
              {/* <PopoverHeader>Действия</PopoverHeader> */}
              {(() => {
                switch (accountStatus) {
                  case "SUCCESS":
                    return <AuthPopover logout={logout} />;
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

const UserData = ({ userData }: any) => {
  if (userData.status === "LOADING") return <Spinner size="sm" color="primary" className="m-auto" />;
  else return <span>{userData.status === "SUCCESS" ? `${userData.data.firstName} ${userData.data.secondName}` : "Войдите в аккаунт"}</span>;
};

const AuthPopover = ({ logout }: any) => {
  return (
    <PopoverBody>
      <button className="my-1 w-100 text-dark text-left rounded-0 btn d-block position-relative">
        <MessageSquare className="mr-2 text-primary " /> Сообщения
        <span className="notification-badge " />
      </button>
      {/* <hr className="my-2" /> */}
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
  accountStatus: store.account.status,
  userData: store.user.data
});

const mapDispatchToProps = {
  logout: accountLogout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
