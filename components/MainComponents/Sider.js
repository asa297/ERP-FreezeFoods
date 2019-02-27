import React, { useState, useEffect } from "react";
import { Layout, Menu, Icon } from "antd";
import { FindTabs } from "<utils>/BL";
import styled from "styled-components";
import Link from "next/link";
import Router from "next/router";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
let au = false;

const SiderComponent = ({ auth, tab }) => {
  const [collapsed, setCollapsed] = useState(false);
  tab = FindTabs(tab);

  useEffect(() => {
    console.log(collapsed);
  }, []);

  return (
    <SiderContainer
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={[`${tab}`]} mode="inline">
        <Menu.Item
          key="1"
          onClick={() => {
            Router.push("/");
            au = true;
          }}
        >
          <Icon type="home" />

          <span>Home</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => Router.push("/login")}>
          <Icon type="lock" />
          <span>Login</span>
        </Menu.Item>
      </Menu>
    </SiderContainer>
  );
};

export default SiderComponent;

const SiderContainer = styled(Sider)`
  height: 100vh;
`;
