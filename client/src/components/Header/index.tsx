import React from "react";

import icon from "./icon.png";
import Search from "../Search";
import UserProfileIcon from "../UserProfileIcon";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

class Header extends React.Component<any> {
  render() {
    const { location } = this.props.router;
    // console.log(location);
    return (
      <div className="shadow-sm w-100 container-fluid bg-white border-bottom" style={{ zIndex: 3 }}>
        <div className="row" style={{ minHeight: "70px" }}>
          <div className="col-auto order-1 d-none d-sm-flex align-items-center">
            <img className="" style={{ objectFit: "contain", maxWidth: "2em" }} src={icon} />
          </div>
          <div className="col-sm-6 col-md-5 col-xl-4 order-2 col-12 py-3 p-sm-0 d-flex align-items-center justify-content-around justify-content-sm-start">
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
          <div className="col-sm-3 align-items-center order-sm-3 p-2 order-5" style={{ display: location.pathname === "/jobs" ? "none" : "flex" }}>
            <Search />
          </div>
          <div className="ml-auto mr-sm-2 col-sm-1 w-100 d-sm-flex d-none order-4 flex-row-reverse align-items-center justify-items-end p-2">
            <UserProfileIcon />
          </div>
        </div>
      </div>
    );
  }
}

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

const mapStateToProps = (store: any) => ({ router: store.router });

export default connect(mapStateToProps)(Header);
