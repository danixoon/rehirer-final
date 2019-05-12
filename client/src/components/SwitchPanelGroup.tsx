import React, { ReactChild } from "react";
import { connect } from "react-redux";
import { history } from "../store/store";
import querystring from "query-string";

interface ISwitchPanelProps {
  activePanel: string;
  [key: string]: any;
}

class SwitchPanelGroup extends React.Component<React.PropsWithChildren<ISwitchPanelProps>> {
  setPanel = (panel: string) => {
    const { location } = this.props.router;
    history.push(location.pathname + "?panel=" + panel);
  };

  getPanel = () => {
    const { location } = this.props.router;
    const params = querystring.parse(location.search);
    return params.panel as string;
  };

  render() {
    const { children } = this.props;
    const panel = this.getPanel();
    const panelNames = [] as string[];

    let activeContent;
    let childProps = {} as any;
    const childs = React.Children.map(children, (child: any) => {
      // if (!React.isValidElement(child)) return;
      let props = child.props as any;
      panelNames.push(props.name);
      if (props.name === panel) {
        activeContent = props.children;
        childProps = { style: props.style, className: props.className };
        return React.cloneElement<any>(child, { ...child.props, active: true });
      } else return React.cloneElement<any>(child, { ...child.props, setPanel: this.setPanel, active: false });
    });
    if (!panelNames.includes(panel)) this.setPanel(panelNames[0]);
    return (
      <div className="container d-flex flex-column">
        <div className="row">{childs}</div>
        <div {...childProps} className={"row " + childProps.className || ""}>
          {activeContent}
        </div>
      </div>
    );
  }
}

export const SwitchPanel = (props: any & { header: string; name: string; active?: boolean; setPanel?: (name: string) => void }) => (
  <div
    onClick={() => props.setPanel && props.setPanel(props.name)}
    className={"col d-flex justify-content-center py-2 " + (props.active ? "bg-primary" : "border-bottom")}
    style={{ cursor: "pointer" }}
  >
    <p className={props.active ? "text-light" : ""}>{props.header}</p>
  </div>
);

const mapStateToProps = (store: any) => ({
  router: store.router
});

export default connect(mapStateToProps)(SwitchPanelGroup);
