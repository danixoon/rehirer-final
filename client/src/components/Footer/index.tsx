import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer bg-dark container-fluid mt-auto" style={{ height: "7.5vh" }}>
        <div className="row">
          <div className="col-4">{""}</div>
        </div>
      </div>
    );
  }
}

const NavItem = (props: { active?: boolean } & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const { children, className, style, active } = props;
  return (
    <div>
      <a href="#" style={{ textDecoration: "none", ...style }} className={`nav-item ${active ? "active" : ""} mx-2 mr-sm-3 mr-md-4 mr-xl-5 mr-0 ${className || ""}`}>
        {children}
      </a>
    </div>
  );
};
export default Footer;
