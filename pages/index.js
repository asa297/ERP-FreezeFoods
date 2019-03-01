// import Layout from "../components/Layout";

import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { testaction } from "<actions>";

class Index extends React.PureComponent {
  render() {
    return <h1>test</h1>;
  }
}

Index.getInitialProps = async ctx => {
  const { auth } = await authInitialProps()(ctx);

  return { auth };
};

export default connect(
  ({ PlayerCardReducer }) => ({ PlayerCardReducer }),
  { testaction }
)(Index);
