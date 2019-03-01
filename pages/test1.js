// import Layout from "../components/Layout";

import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import axios from "axios";
import { testaction } from "<actions>";

class Test1 extends React.PureComponent {
  render() {
    return <button onClick={() => this.test()}>11111</button>;
  }
}

Test1.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);
  await checkUserRole(auth)(ctx);

  return { auth };
};

export default Test1;
