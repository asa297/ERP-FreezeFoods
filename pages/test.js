// import Layout from "../components/Layout";

import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import axios from "axios";
import { testaction } from "<actions>";

axios.defaults.withCredentials = true;

class Test extends React.PureComponent {
  render() {
    return <button onClick={() => this.test()}>11111</button>;
  }
}

Test.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);
  await checkUserRole(auth)(ctx);

  return { auth };
};

export default Test;
