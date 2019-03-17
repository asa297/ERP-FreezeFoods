import { Menu, Icon } from "antd";
import { MenuItem } from "<components>";
import { logoutUser } from "<utils>/auth";
import { RoleMappingRoute } from "../static/data.json";
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
              <span
                onClick={
                  GetListPath(CategoryPage)
                    ? () => Router.push(GetListPath(CategoryPage))
                    : null
                }
              >
                หมวดสินค้า
              </span>
            </MenuItem>
          ) : null}

          {ItemPage.length ? (
            <MenuItem routeform={GetFormPath(ItemPage)}>
              <span
                onClick={
                  GetListPath(ItemPage)
                    ? () => Router.push(GetListPath(ItemPage))
                    : null
                }
              >
                สินค้า
              </span>
            </MenuItem>
          ) : null}

          {UnitPage.length ? (
            <MenuItem routeform={GetFormPath(UnitPage)}>
              <span
                onClick={
                  GetListPath(UnitPage)
                    ? () => Router.push(GetListPath(UnitPage))
                    : null
                }
              >
                หน่วยสินค้า
              </span>
            </MenuItem>
          ) : null}

          {ContactPage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(ContactPage)}>
              <span
                onClick={
                  GetListPath(ContactPage)
                    ? () => Router.push(GetListPath(ContactPage))
                    : null
                }
              >
                บริษัท
              </span>
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
              <span
                onClick={
                  GetListPath(RequestPage)
                    ? () => Router.push(GetListPath(RequestPage))
                    : null
                }
              >
                ใบขอซื้อ
              </span>
            </MenuItem>
          ) : null}

          {PurchasePage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(PurchasePage)}>
              <span
                onClick={
                  GetListPath(PurchasePage)
                    ? () => Router.push(GetListPath(PurchasePage))
                    : null
                }
              >
                ใบสั่งซื้อ
              </span>
            </MenuItem>
          ) : null}

          {ReceiveSuppierPage.length !== 0 ? (
            <MenuItem routeform={GetFormPath(ReceiveSuppierPage)}>
              <span
                onClick={
                  GetListPath(ReceiveSuppierPage)
                    ? () => Router.push(GetListPath(ReceiveSuppierPage))
                    : null
                }
              >
                ใบรับของ
              </span>
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
        <span>ออกจากระบบ</span>
      </Menu.Item>
    </Menu>
  );
};
