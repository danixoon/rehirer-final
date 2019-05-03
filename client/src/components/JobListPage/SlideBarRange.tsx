import React from "react";
import Spoiler from "./Spoiler";

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

export default SlideBarRange;
