import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { test } from "<actions>";
import { Table } from "antd";

const columns = [
  {
    title: "Id",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  }
];

class List extends React.PureComponent {
  componentWillMount() {
    this.props.test();
  }

  render() {
    return <Table dataSource={[]} columns={columns} />;
  }
}

List.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);

  if (auth) {
    await checkUserRole(auth)(ctx);

    // ctx.reduxStore.dispatch(test(ctx));
  }

  return { auth };
};

export default connect(
  ({ ItemCategoryReducer }) => ({ ItemCategoryReducer }),
  { test }
)(List);
