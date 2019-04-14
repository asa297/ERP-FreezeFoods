import React from "react";
import styled from "styled-components";
import { Icon } from "antd";
import { DocStatus } from "<components>";

const ListHeader = ({
  title,
  icon = "database",
  status,
  color = "#002140"
}) => {
  return (
    <Header color={color}>
      <Icon type={icon} style={{ fontSize: "2em", color: "white" }} />
      <H1TextCenter>{title}</H1TextCenter>
      {status ? <DocStatus status={status} /> : null}
    </Header>
  );
};

export default ListHeader;

const H1TextCenter = styled.h1`
  padding: 10px;
  margin: 0;
  color: white;
`;

const Header = styled.div`
  background: ${props => props.color};
  display: flex;
  align-items: center;
  padding: 0px 10px;
  width: 100%;
  height: 10vh;
`;
