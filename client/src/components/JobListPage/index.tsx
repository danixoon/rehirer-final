import React from "react";

import background from "../images/background.jpg";

import logoBig from "../images/logo-big.png";

import Search from "../Search";
import UserProfileIcon from "../UserProfileIcon";
import { X, ChevronRight, ChevronDown, ArrowDown, ArrowLeft, ArrowRight } from "react-feather";
import { string } from "joi";
// import { Sidebar } from "react-feather";

class JobListPage extends React.Component {
  render() {
    return (
      <div className="fluid-container bg-white">
        <div className="row no-gutters">
          <div className="col-sm-12 col-md-4 col-lg-3 col-xl-2 col">
            <SideBar />
          </div>
          <div className="col-sm-12 col-md col-lg p-3">
            <div className="container p-0">
              <SortPanel />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class SortPanel extends React.Component {
  render() {
    return (
      <div className="fluid-container no-gutters">
        <div className="row mb-4">
          <div className="col d-flex justify-content-lg-end justify-content-center">
            <Pagination className="" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4 col-lg-3 col-sm-auto mb-4 mb-sm-0 order-md-1 order-3 d-flex">
            <span className="mx-auto mx-sm-0">100 результатов</span>
          </div>
          <div className="col col-md-auto d-flex order-md-2 order-4">
            <SortParameter label="Цена" className="" />
            <SortParameter label="Название" className="" />
          </div>
        </div>
      </div>
    );
  }
}

class Pagination extends React.Component<any> {
  render() {
    return (
      <div {...this.props} className="d-flex">
        <span className="px-2">
          <a href="#" className="text-primary">
            ←
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary active">
            1
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            2
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            3
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            ...
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            56
          </a>
        </span>
        <span className="px-2">
          <a href="#" className="text-primary">
            →
          </a>
        </span>
      </div>
    );
  }
}

class SortParameter extends React.Component<{ label: string; onChange?: (asc: boolean) => void } & any> {
  state = {
    asc: false
  };

  toggle = () => {
    let { asc } = this.state;
    asc = !asc;
    this.setState({ asc });
    if (this.props.onChange) this.props.onChange(asc);
  };
  render() {
    const { label } = this.props;
    const { asc } = this.state;
    return (
      <div {...this.props} onClick={this.toggle}>
        <span>{label}</span>
        <ArrowDown className="text-primary p-1" style={{ transition: "transform 0.1s ease", transform: `rotate(${asc ? 0 : 180}deg)` }} />
      </div>
    );
  }
}

class SideBar extends React.Component {
  state = {
    open: false,
    items: ["Вася", "Пупя"]
  };

  removeItem = (id: number) => {
    const { items } = this.state;
    items.splice(id, 1);
    this.setState({ items });
  };

  addItem = (label: string) => {
    this.setState({ items: [...this.state.items, label] });
  };

  render() {
    const { items } = this.state;

    return (
      <div className="shadow-sm p-3 overflow-auto sticky-top bg-white border border-top-0" style={{ zIndex: 4 }}>
        {/* <input placeholder="Введите запрос" className="input w-100" /> */}
        <div className="mb-3">
          <button className="btn btn-primary w-100 rounded-0 mb-3">Предложить вакансию</button>
          <Search />
        </div>
        <SlideBarTree
          placeholder="Введите имя"
          onSubmit={this.addItem}
          items={items.map((item, i) => ({ label: item, onClick: () => this.removeItem(i) }))}
          header="Список мёртвых"
        />
        <SlideBarTree
          placeholder="Введите имя"
          onSubmit={this.addItem}
          items={items.map((item, i) => ({ label: item, onClick: () => this.removeItem(i) }))}
          header="Список живых"
        />
        <SlideBarRange label="Цена" />
      </div>
    );
  }
}

interface ISlideBarTreeProps {
  header: string;
  placeholder: string;
  items: { label: string; onClick?: (e: any) => void }[];
  onSubmit?: (value: string) => void;
}

const SlideBarRange = (props: { label: string } & any) => {
  const { label } = props;
  return (
    <Spoiler header="Цена" height={2 * 3 + 4}>
      <div className="d-flex">
        <span className="mx-2">От</span>
        <input className="w-100" placeholder="10000 р" />
      </div>
      <div className="d-flex">
        <span className="mx-2">До</span>
        <input className="w-100" placeholder="10000 р" />
      </div>
    </Spoiler>
  );
};

class Spoiler extends React.Component<{ header: string; height: number } & any> {
  state = {
    open: false
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
    // console.log(this.state.open);
  };

  render() {
    const { children, header, height } = this.props;
    const { open } = this.state;
    return (
      <div className="d-flex flex-column">
        <p className="text-dark mb-1" onClick={this.toggle}>
          <ChevronDown className="text-primary p-1" style={{ transition: "transform 0.1s ease", transform: `rotate(${open ? 0 : -90}deg)` }} />
          {header}
        </p>
        <div style={{ overflow: "hidden", whiteSpace: "nowrap", maxHeight: open ? `${height}rem` : "0px", transition: "max-height 0.2s ease" }}>{children}</div>
      </div>
    );
  }
}

class SlideBarTree extends React.Component<ISlideBarTreeProps> {
  state = {
    input: "",
    open: false
  };

  onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e: any, value: string) => {
    const { onSubmit } = this.props;
    if (!onSubmit) return;
    e.target.value = "";
    this.onChange(e);

    onSubmit(value);
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { header, items, placeholder } = this.props;
    const { input, open } = this.state;
    // this.

    return (
      <Spoiler header={header} height={items.length * 3 + 4}>
        {items.map((item, i) => (
          <div className="text-secondary" key={i}>
            <X className="text-primary mr-2 p-1" onClick={item.onClick} />
            <span className="d-inline text-truncate">{item.label}</span>
          </div>
        ))}
        <input
          className="mb-2"
          placeholder={placeholder}
          name="input"
          value={input}
          onChange={this.onChange}
          onKeyDown={e => (e.key === "Enter" ? this.onSubmit(e, input) : "")}
          style={{ marginLeft: "2rem", width: "calc(100% - 2rem)" }}
        />
      </Spoiler>
    );

    return (
      <div className="d-flex flex-column">
        <p className="text-dark mb-1" onClick={this.toggle}>
          <ChevronDown className="text-primary p-1" style={{ transition: "transform 0.1s ease", transform: `rotate(${open ? 0 : -90}deg)` }} />
          {header}
        </p>
        <div style={{ overflow: "hidden", whiteSpace: "nowrap", maxHeight: open ? `${items.length * 3 + 4}rem` : "0px", transition: "max-height 0.2s ease" }} />
        {/* <div className="text-secondary">
          <X className="text-primary mr-2 p-1" />
          <span>a iam</span>
        </div> */}

        {/* <p className="text-secondary">die today</p> */}
      </div>
    );
  }
}

const JobInfo = (props: { label: string } & any) => (
  <div className="mb-2">
    <p>{props.label}</p>
    <a href="#">
      <span>{props.children}</span>
    </a>
  </div>
);

class JobCard extends React.Component {
  render() {
    return (
      <div className="border rounded container-fluid no-gutters mb-2">
        <div className="row">
          <div className="col-sm-4 col-lg-3 border-bottom-0 border-md-right py-2 order-sm-1 order-2">
            <JobInfo label="Работодатель">Ужасный Жужа ЖЖ</JobInfo>
            <JobInfo label="Расстояние">500м</JobInfo>
            <JobInfo label="Время выполнения">1 час</JobInfo>
            <JobInfo label="Предложенная цена">1000р</JobInfo>
            <button className="btn-primary btn w-100 rounded-0">Откинуться</button>
          </div>
          <div className="col py-2 order-1">
            <a href="#">
              <h3>Выгулять собаку</h3>
            </a>
            <span>what, aht, sdhf</span>
            <hr />
            <span>
              Ну короче тут у нас везде помойка свалка ужасное место никому не советую ну и вот нужно кому-нибудь прибраться, так-то я сам инвалид поэтому мне сложно спасите
              помогите спасибо ы
            </span>
          </div>
        </div>
      </div>
    );
  }
}

// const StartPageMessage = (props: { header: string } & React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
//   const { children, className, style, header } = props;
//   return (
//     <div className="mb-5">
//       <h3 className="">{header}</h3>
//       <p className="">{children}</p>
//     </div>
//   );
// };

export default JobListPage;
