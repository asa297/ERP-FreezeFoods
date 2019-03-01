import React, { useState, useEffect } from "react";
import { Layout, Menu, Icon } from "antd";
import styled from "styled-components";
import Router from "next/router";
import { logoutUser } from "<utils>/auth";
import { isEmpty } from "lodash";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const SiderComponent = ({ auth, UserRole }) => {
  console.log("UserRole", auth);
  const [collapsed, setCollapsed] = useState(true);
  return (
    <SiderContainer
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <div className="logo">
        <TextInLogo>{auth ? auth.user.name : "Guest"}</TextInLogo>
      </div>

      {!auth ? (
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" onClick={() => Router.push("/")}>
            <Icon type="home" />
            <span>Home</span>
          </Menu.Item>
          <Menu.Item key="2" onClick={() => Router.push("/login")}>
            <Icon type="lock" />
            <span>Login</span>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" onClick={() => Router.push("/")}>
            <Icon type="home" />
            <span>Home</span>
          </Menu.Item>
          <Menu.Item
            key="999"
            onClick={() => {
              logoutUser();
            }}
          >
            <Icon type="unlock" />
            <span>Logout</span>
          </Menu.Item>
        </Menu>
      )}
    </SiderContainer>
  );
};

export default SiderComponent;

const SiderContainer = styled(Sider)`
  height: 100vh;
`;

const TextInLogo = styled.p`
  padding: 5px;
  white-space: nowrap;
  /* width: 50px; */
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
  text-align: center;
`;
