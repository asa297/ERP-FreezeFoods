import { Menu, Icon } from "antd";
import Router from "next/router";

const MenuItem = ({ routelist, routeform, children, ...props }) => (
  <Menu.Item {...props} style={{ cursor: "text" }}>
    {routeform ? (
      <Icon
        type="plus"
        theme="outlined"
        onClick={() => Router.push(routeform)}
        style={{ cursor: "pointer" }}
      />
    ) : null}

    {children}
  </Menu.Item>
);

export default MenuItem;
