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
  return (
    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      <Menu.Item key="1" onClick={() => Router.push("/")}>
        <Icon type="home" />
        <span>Home</span>
      </Menu.Item>
      {ManageModule.length > 0 ? (
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="book" />
              <span>User</span>
            </span>
          }
        >
          <MenuItem routeform={GetFormPath(CategoryPage)}>
            <span
              onClick={
                GetListPath(CategoryPage)
                  ? () => Router.push(GetListPath(CategoryPage))
                  : null
              }
            >
              Category
            </span>
          </MenuItem>
          <MenuItem routeform={GetFormPath(ItemPage)}>
            <span
              onClick={
                GetListPath(ItemPage)
                  ? () => Router.push(GetListPath(ItemPage))
                  : null
              }
            >
              Item
            </span>
          </MenuItem>

          <MenuItem routeform={GetFormPath(UnitPage)}>
            <span
              onClick={
                GetListPath(UnitPage)
                  ? () => Router.push(GetListPath(UnitPage))
                  : null
              }
            >
              Unit
            </span>
          </MenuItem>
          <MenuItem routeform={GetFormPath(ContactPage)}>
            <span
              onClick={
                GetListPath(ContactPage)
                  ? () => Router.push(GetListPath(ContactPage))
                  : null
              }
            >
              Contact
            </span>
          </MenuItem>
        </SubMenu>
      ) : null}

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
  );
};
