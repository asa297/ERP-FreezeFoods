import { Menu, Icon } from "antd";
import Router from "next/router";

const MenuItem = ({ routelist, routeform, children, ...props }) => (
  <Menu.Item {...props}>
    {routeform ? (
      <Icon
        type="plus"
        theme="outlined"
        onClick={() => Router.push(routeform)}
      />
    ) : null}

    {children}
  </Menu.Item>
);

export default MenuItem;
