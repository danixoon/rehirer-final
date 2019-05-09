import React from "react";

import background from "../../images/background.jpg";

import logoBig from "../../images/logo-big.png";

class StartPage extends React.Component<any> {
  render() {
    return (
      <div className="fluid-container bg-white">
        <div className="row no-gutters">
          <div className="col-sm-auto col-lg-4 col-md-5 col-auto order-3 order-md-1 p-3 pt-5 ">
            <StartPageMessage header="Работодателям">Тысячи пользователей ждут ваших вакансий и готовы принять вас</StartPageMessage>
            <StartPageMessage header="Для обычных людей">Продайте себя в рабство прямо сейчас! По супер-цене, целых 0.00 рублей за голову</StartPageMessage>
          </div>
          <div className="col-sm order-2 overflow-none" style={{ height: "85vh", minHeight: "500px", backgroundImage: `url(${background})` }}>
            <div className="py-5 h-100">
              <div className="m-auto d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: "white", height: "100%" }}>
                <h1 className="text-primary mb-0 d-flex" style={{ fontSize: "6rem" }}>
                  <img className="mb-auto d-md-block d-none" style={{ width: "1em" }} src={logoBig} />
                  Rehirer
                </h1>
                <h3 className="text-dark">Поиск подработок</h3>

                <button onClick={() => this.props.history.push("/jobs")} className="btn btn-primary rounded-0 p-3 px-5 mt-5">
                  Найти работу
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const StartPageMessage = (props: { header: string } & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const { children, className, style, header } = props;
  return (
    <div className="mb-5">
      <h3 className="">{header}</h3>
      <span className="">{children}</span>
    </div>
  );
};

export default StartPage;
