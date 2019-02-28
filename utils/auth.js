import axios from "axios";
import Router from "next/router";

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
  const auth = req ? getServerSideToken(req) : getClientSideToken();
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
    // redirectUser(res, "/");
  }
};

export const logoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = undefined;
    Router.push("/");
    // redirectUser(res, "/");
  }
  await axios.post("/api/logout");
};

export const getUserProfile = async () => {
  const { data } = await axios.get("/api/profile");
  return data;
};

// export const checkUserRole = auth => async ({ req, res }) => {
//   if (auth) {
//     const {
//       user: { _id }
//     } = auth;
//     axios.get("/api/checkRole", { _id }).then(test => {
//       console.log(test);
//     });

// console.log(data);
// }
// };
