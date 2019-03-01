import axios from "axios";
import Router from "next/router";
import { RoleMappingRoute } from "../static/data.json";

axios.defaults.withCredentials = true;

export const getServerSideToken = req => {
  const { signedCookies = {} } = req;

  if (!signedCookies) {
    return;
  } else if (!signedCookies.token) {
    return;
  }
  return signedCookies.token ? { user: signedCookies.token } : undefined;
};

export const getClientSideToken = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || undefined;
    return user ? { user } : undefined;
  }
  return;
};

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserScript = user => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const authInitialProps = isProtectedRoute => ({ req, res }) => {
  let auth = req ? getServerSideToken(req) : getClientSideToken();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth ? auth.user : false;

  const isAnonymous = !user || user.type !== "authenticated";
  if (isProtectedRoute && isAnonymous && currentPath !== "/login") {
    return redirectUser(res, "/login");
  }

  return { auth };
};

const redirectUser = (res, path) => {
  if (res) {
    res.redirect(302, path);
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

export const loginUser = async (Username, Password) => {
  const { data } = await axios.post("/api/login", { Username, Password });
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || undefined;
    Router.push("/");
  }
};

export const logoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = undefined;
    Router.push("/");
  }
  await axios.post("/api/logout");
};

export const getUserProfile = async () => {
  const { data } = await axios.get("/api/profile");
  return data;
};

export const checkUserRole = auth => async ({ req, res }) => {
  if (auth) {
    const {
      user: { _id, role }
    } = auth;
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
    const { data, status } = await axios.get(baseUrl + "/api/checkRole/" + _id);

    if (status !== 200) redirectUser(res, "/");
    const { UserRole } = data;
    if (role !== UserRole) {
      res.clearCookie("token");
      return redirectUser(res, "/");
    }
    const path = RoleMappingRoute.find(l =>
      l.path === req ? req.url : window.location.pathname
    );
    if (!path) return redirectUser(res, "/");
    const hasPermission = path.role.find(role => role === UserRole);
    if (!hasPermission) return redirectUser(res, "/");
  } else {
    return redirectUser(res, "/");
  }

  return {};
};
