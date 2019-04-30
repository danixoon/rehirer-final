import React from "react";
import avatar from "../../images/sticker.webp";
import { Star } from "react-feather";
import _ from "lodash";

const UserRating = ({ rating, className }: { rating: number; className?: string }) => {
  return (
    <div className={className}>
      <div className="text-right" style={{ clipPath: `inset(0 ${(1 - rating) * 10}rem 0 0)` }}>
        {_.range(0, 5).map(v => (
          <Star height="2rem" width="2rem" key={v} className="fill-primary" strokeWidth={0} />
        ))}
      </div>
      <div className="text-right" style={{ marginTop: "-2rem" }}>
        {_.range(0, 5).map(v => (
          <Star height="2rem" width="2rem" key={v} className="text-secondary-transparent" strokeWidth={1} />
        ))}
      </div>
    </div>
  );
};

class UserProfilePage extends React.Component {
  render() {
    return (
      <div className="container row no-gutters mx-auto border border-top-0 bg-white" style={{ minHeight:"80vh", zIndex: 5 }}>
        <div className="col-sm-4 col">
          <img className="w-100" src={avatar} />
          <button className="btn border-primary text-primary w-100 mt-1 rounded-0">Сменить изображение</button>
          <div className="d-flex mt-2 align-items-end">
            <p className="mb-0">Рейтинг</p> <UserRating className="ml-auto" rating={0.5} />
          </div>
          <div className="d-flex mt-2">
            <p className="mb-0">Зарегистрирован</p> <span className="ml-auto">19.09.19</span>
          </div>
          <div className="d-flex mt-2">
            <p className="mb-0">Отзывы</p> <span className="ml-auto">33</span>
          </div>
        </div>
        <div className="col-sm-4 col-auto"> </div>
        <div className="col-sm-4 col-auto"> </div>
      </div>
    );
  }
}

export default UserProfilePage;
