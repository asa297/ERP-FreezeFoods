import { Layout } from "antd";
import { Sider, LoginForm } from "<components>";
import { authInitialProps } from "<utils>/auth";

class Login extends React.PureComponent {
  render() {
    return <LoginForm />;
  }
}

Login.getInitialProps = ctx => {
  const { auth } = authInitialProps()(ctx);
  return { auth };
};

export default Login;
