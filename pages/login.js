import { Layout } from "antd";
import { LoginForm } from "<components>";
import { authInitialProps, checkUserRole } from "<utils>/auth";

class Login extends React.PureComponent {
  render() {
    return <LoginForm />;
  }
}

Login.getInitialProps = async ctx => {
  const { auth } = await authInitialProps()(ctx);
  return { auth };
};

export default Login;
