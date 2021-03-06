import React, { useState } from "react";
import { Layout, Menu, Icon } from "antd";
import styled from "styled-components";
import Router from "next/router";

import { MenuManage } from "<utils>/menu";

const { Sider } = Layout;

const SiderComponent = ({ auth }) => {
  // console.log("UserRole", auth);
  const [collapsed, setCollapsed] = useState(true);
  return (
    <SiderContainer
    // collapsible
    // collapsed={collapsed}
    // onCollapse={() => setCollapsed(!collapsed)}
    >
      {!auth ? (
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" onClick={() => Router.push("/")}>
            <Icon type="home" />
            <span>หน้าหลัก</span>
          </Menu.Item>
          <Menu.Item key="2" onClick={() => Router.push("/login")}>
            <Icon type="lock" />
            <span>เข้าสู่ระบบ</span>
          </Menu.Item>
        </Menu>
      ) : (
        MenuManage({ UserRole: auth.user.role })
      )}
      }
      <Test>
        <TextInLogo>{auth ? auth.user.name : "Guest"}</TextInLogo>
      </Test>
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

const Test = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0px;

  height: 32px;
  background: rgba(255, 255, 255, 0.2);

  color: white;
`;
