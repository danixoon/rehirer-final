import React from "react";

import icon from "./icon.png";
import Search from "../Search";
import UserProfileIcon from "../UserProfileIcon";

import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { MessageSquare, User } from "react-feather";

import { Manager, Popper, Reference } from "react-popper";


class Header extends React.Component<any> {
  render() {




    const { location } = this.props.router;
    // console.log(location);
    return (
      <div className="shadow-sm w-100 container-fluid bg-white border-bottom" style={{ zIndex: 3 }}>
        <div className="row" style={{ minHeight: "70px" }}>
          <div className="col-auto order-1 d-none d-md-flex align-items-center">
            <img className="" style={{ objectFit: "contain", maxWidth: "2em" }} src={icon} />
          </div>
          <div className="col col-md-5 col-xl-4 order-2 col-12 py-3 p-md-0 d-flex align-items-center justify-content-around justify-content-lg-start">
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
          <div className="col-md-3 align-items-center order-sm-3 p-2 order-4" style={{ display: location.pathname === "/jobs" ? "none" : "flex" }}>
            <Search />
          </div>
          <div className="mr-sm-2 col-sm w-100 d-flex order-4 align-items-center justify-items-end justify-content-end  p-2">
            {/* <button className="btn btn-primary rounded-pill p-2 d-flex"><MessageSquare /></button> */}
            <span className="text-dark mx-auto mr-md-2">Иван Иванович</span>
            <button className="btn btn-primary rounded-pill p-2 position-relative">
              <User />
              {/* <div> */}
              <span className="notification-badge rounded-pill bg-danger" />
              {/* </div> */}
            </button>
            
          </div>
        </div>
      </div>
    );
  }
}

const Example = () => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <button type="button" ref={ref}>
          Reference element
        </button>
      )}
    </Reference>
    <Popper placement="right">
      {({ ref, style, placement, arrowProps }) => (
        <div ref={ref} style={style} data-placement={placement}>
          Popper element
          <div ref={arrowProps.ref} style={arrowProps.style} />
        </div>
      )}
    </Popper>
  </Manager>
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

const mapStateToProps = (store: any) => ({ router: store.router });

export default connect(mapStateToProps)(Header);
