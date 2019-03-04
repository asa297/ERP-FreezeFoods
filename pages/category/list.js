import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItemCategory } from "<actions>";
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
  render() {
    return <Table dataSource={[]} columns={columns} />;
  }
}

List.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);
  console.log(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);
    // console.log(ctx);
    // ctx.store.dispatch(GetItemCategory());
  }

  return { auth };
};

export default connect(
  ({ ItemCategoryReducer }) => ({ ItemCategoryReducer }),
  null
)(List);
