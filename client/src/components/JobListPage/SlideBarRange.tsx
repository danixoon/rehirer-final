import React from "react";
import Spoiler from "./Spoiler";
import { InputValidateGroup, InputValidate } from "../ValidateInputField";
import joi from "joi";

const SlideBarRange = (props: { label: string; onMinChange: (value: number) => void; onMaxChange: (value: number) => void }) => {
  const { label } = props;
  return (
    <Spoiler header={label} height={2 * 3 + 4}>
      <div className="d-flex">
        <span className="mx-2">От</span>
        <InputValidateGroup
          validated={(correct, data) => {
            if (correct) props.onMinChange(data.min);
          }}
        >
          <InputValidate name="min" hardCheck schema={joi.number().allow("")}>
            <input className="w-100" placeholder="10000 р" />
          </InputValidate>
        </InputValidateGroup>
      </div>
      <div className="d-flex">
        <span className="mx-2">До</span>
        <InputValidateGroup
          validated={(correct, data) => {
            if (correct) props.onMaxChange(data.max);
          }}
        >
          <InputValidate name="max" hardCheck schema={joi.number().allow("")}>
            <input className="w-100" placeholder="10000 р" />
          </InputValidate>
        </InputValidateGroup>
      </div>
    </Spoiler>
  );
};

export default SlideBarRange;
