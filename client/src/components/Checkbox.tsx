import React from "react";

export default (props: { label: string; id: string; checked: boolean; toggle: (e: any) => void; className?: string; style?: React.CSSProperties }) => (
  <div className={"custom-control custom-checkbox mr-sm-2 " + props.className || ""} style={props.style}>
    <input onChange={props.toggle} type="checkbox" className="custom-control-input" id={props.id} checked={props.checked} />
    <label className="custom-control-label d-flex" htmlFor={props.id}>
      <p style={{ marginTop: "0.1rem" }}>{props.label}</p>
    </label>
  </div>
);
