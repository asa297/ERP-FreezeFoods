import React, { useState } from "react";
import { Layout, Menu, Icon } from "antd";
import styled from "styled-components";
import Link from "next/link";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const SiderComponent = ({ auth }) => {
  console.log(auth);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SiderContainer
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <Link href="/login">
            <span>Login </span>
          </Link>
        </Menu.Item>
      </Menu>
    </SiderContainer>
  );
};

export default SiderComponent;

const SiderContainer = styled(Sider)`
  height: 100vh;
`;
