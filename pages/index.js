// import Layout from "../components/Layout";
import Link from "next/link";
import { connect } from "react-redux";
import { authInitialProps } from "<utils>/auth";
import { testaction } from "<actions>";
import { Layout } from "antd";
import Silder from "<components>/Sider";

class Index extends React.PureComponent {
  componentWillMount() {
    this.props.testaction();
  }

  render() {
    console.log(this.props);
    return (
      <Layout>
        <Silder auth={this.props.auth} />

        <h1>test</h1>
      </Layout>
    );
  }
}

Index.getInitialProps = ctx => {
  const { auth } = authInitialProps()(ctx);

  return { auth };
};

export default connect(
  ({ PlayerCardReducer }) => ({ PlayerCardReducer }),
  { testaction }
)(Index);
