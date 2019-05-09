import React from "react";
import _ from "lodash";
import { Star } from "react-feather";

const UserRating = ({ rating, className }: { rating: number; className?: string }) => {
  return (
    <div className={className}>
      <div className="" style={{ clipPath: `inset(0 ${(1 - rating) * 10}rem 0 0)`, width: `${5 * 2}rem` }}>
        {_.range(0, 5).map(v => (
          <Star height="2rem" width="2rem" key={v} className="fill-primary" strokeWidth={0} />
        ))}
      </div>
      <div className="" style={{ marginTop: "-2rem", zIndex: 3, width: `${5 * 2}rem` }}>
        {_.range(0, 5).map(v => (
          <Star height="2rem" width="2rem" key={v} className="text-secondary-transparent" strokeWidth={1} />
        ))}
      </div>
    </div>
  );
};

export default UserRating;
