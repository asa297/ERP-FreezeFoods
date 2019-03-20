import { Menu, Icon } from "antd";
import { MenuItem } from "<components>";
import { logoutUser } from "<utils>/auth";
import { RoleMappingRoute } from "../static/data.json";
import styled from "styled-components";
import Router from "next/router";
const SubMenu = Menu.SubMenu;

const GetListPath = PathList => {
  const listPath = PathList.find(l => l.type === "List");
  return listPath ? listPath.path : undefined;
};

const GetFormPath = PathList => {
  const listPath = PathList.find(l => l.type === "Form");
  return listPath ? listPath.path : undefined;
};

export const MenuManage = ({ UserRole }) => {
  const ManageModule = RoleMappingRoute.filter(
    route =>
      route.sub === "manage" && route.role.find(role => role === UserRole)
  );

  const CategoryPage = RoleMappingRoute.filter(
    route =>
      route.page === "Category" && route.role.find(role => role === UserRole)
  );
  const ItemPage = RoleMappingRoute.filter(
    route => route.page === "Item" && route.role.find(role => role === UserRole)
  );

  const UnitPage = RoleMappingRoute.filter(
    route => route.page === "Unit" && route.role.find(role => role === UserRole)
  );
  const ContactPage = RoleMappingRoute.filter(
    route =>
      route.page === "Contact" && route.role.find(role => role === UserRole)
  );

  const DocumentModule = RoleMappingRoute.filter(
    route =>
      route.sub === "document" && route.role.find(role => role === UserRole)
  );

  const RequestPage = RoleMappingRoute.filter(
    route =>
      route.page === "Request" && route.role.find(role => role === UserRole)
  );

  const PurchasePage = RoleMappingRoute.filter(
    route =>
      route.page === "Purchase" && route.role.find(role => role === UserRole)
  );

  const ReceiveSuppierPage = RoleMappingRoute.filter(
    route =>
      route.page === "ReceiveSuppier" &&
      route.role.find(role => role === UserRole)
  );
  const DeliveryNotePage = RoleMappingRoute.filter(
    route =>
      route.page === "DeliveryNote" &&
      route.role.find(role => role === UserRole)
  );
  const ReceiveNotePage = RoleMappingRoute.filter(
    route =>
      route.page === "ReceiveNote" && route.role.find(role => role === UserRole)
  );

  return (
    <Menu theme="dark" mode="inline">
      <Menu.Item key="1" onClick={() => Router.push("/")}>
        <Icon type="home" />
        <span>หน้าหลัก</span>
      </Menu.Item>
      {ManageModule.length > 0 ? (
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="book" />
              <span>การจัดการ</span>
            </span>
          }
        >
          {CategoryPage.length ? (
            <MenuItem routeform={GetFormPath(CategoryPage)}>
              <SpanPointer
                onClick={
                  GetListPath(CategoryPage)
                    ? () => Router.push(GetListPath(CategoryPage))
                    : null
                }
              >
                หมวดสินค้า
              </SpanPointer>
            </MenuItem>
          ) : null}

          {ItemPage.length ? (
            <MenuItem routeform={GetFormPath(ItemPage)}>
              <SpanPointer
                onClick={
                  GetListPath(ItemPage)
                    ? () => Router.push(GetListPath(ItemPage))
                    : null
                }
              >
                สินค้า
              </SpanPointer>
            </MenuItem>
          ) : null}

          {UnitPage.length ? (
            <MenuItem routeform={GetFormPath(UnitPage)}>
              <SpanPointer
                onClick={
                  GetListPath(UnitPage)
                    ? () => Router.push(GetListPath(UnitPage))
                    : null
                }
              >
                หน่วยสินค้า
              </SpanPointer>
            </MenuItem>
          ) : null}

          {ContactPage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(ContactPage)}>
              <SpanPointer
                onClick={
                  GetListPath(ContactPage)
                    ? () => Router.push(GetListPath(ContactPage))
                    : null
                }
              >
                บริษัท
              </SpanPointer>
            </MenuItem>
          ) : null}
        </SubMenu>
      ) : null}

      {DocumentModule.length !== 0 ? (
        <SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="form" />
              <span>เอกสาร</span>
            </span>
          }
        >
          {RequestPage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(RequestPage)}>
              <SpanPointer
                onClick={
                  GetListPath(RequestPage)
                    ? () => Router.push(GetListPath(RequestPage))
                    : null
                }
              >
                ใบขอซื้อ
              </SpanPointer>
            </MenuItem>
          ) : null}

          {PurchasePage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(PurchasePage)}>
              <SpanPointer
                style={{ cursor: "pointer" }}
                onClick={
                  GetListPath(PurchasePage)
                    ? () => Router.push(GetListPath(PurchasePage))
                    : null
                }
              >
                ใบสั่งซื้อ
                <div>test</div>
              </SpanPointer>
            </MenuItem>
          ) : null}

          {ReceiveSuppierPage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(ReceiveSuppierPage)}>
              <SpanPointer
                onClick={
                  GetListPath(ReceiveSuppierPage)
                    ? () => Router.push(GetListPath(ReceiveSuppierPage))
                    : null
                }
              >
                ใบรับของ
              </SpanPointer>
            </MenuItem>
          ) : null}

          {DeliveryNotePage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(DeliveryNotePage)}>
              <SpanPointer
                onClick={
                  GetListPath(DeliveryNotePage)
                    ? () => Router.push(GetListPath(DeliveryNotePage))
                    : null
                }
              >
                ใบส่งของ
              </SpanPointer>
            </MenuItem>
          ) : null}

          {ReceiveNotePage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(ReceiveNotePage)}>
              <SpanPointer
                onClick={
                  GetListPath(ReceiveNotePage)
                    ? () => Router.push(GetListPath(ReceiveNotePage))
                    : null
                }
              >
                ใบรับของคืน
              </SpanPointer>
            </MenuItem>
          ) : null}
        </SubMenu>
      ) : null}

      <Menu.Item
        key="999"
        onClick={() => {
          logoutUser();
        }}
      >
        <Icon type="unlock" />
        <SpanPointer>ออกจากระบบ</SpanPointer>
      </Menu.Item>
    </Menu>
  );
};

const SpanPointer = styled.span`
  cursor: pointer;
`;
