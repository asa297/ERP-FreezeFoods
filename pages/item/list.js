import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItem, ClearItem } from "<actions>";
import { Table, Icon } from "antd";
import styled from "styled-components";
// import { Link } from "<routes>";
import Link from "next/link";
import { PaginationList } from "<components>";

class List extends React.PureComponent {
  state = {
    page: 1
  };

  componentWillMount() {
    this.props.ClearItem();
    this.props.GetItem(this.state.page);
  }

  render() {
    const columns = [
      {
        title: "รหัส",
        dataIndex: "id",
        width: "10%",
        align: "center"
      },
      {
        title: "ชื่อ",
        dataIndex: "name",
        width: "20%"
      },
      {
        title: "หมวดสินค้า",
        dataIndex: "item_category_name",
        width: "20%"
      },
      {
        title: "จำนวน",
        dataIndex: "qty",
        width: "20%",
        align: "center"
      },
      {
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "25%"
      },
      {
        title: "",
        dataIndex: "",
        width: "5%",
        render: (text, record) => {
          return (
            <Link
              href={{ pathname: "/item/form", query: { id: record.id } }}
              prefetch
            >
              <a onClick={() => this.setState({ loading: true })}>
                <Icon type="form" style={{ fontSize: "22px" }} />
              </a>
            </Link>
          );
        }
      }
    ];

    const { page } = this.state;
    const { ItemReducer } = this.props;

    return (
      <ListContainer>
        <Container>
          <HeaderContainer>
            <HeaderLabel>รายการสินค้า </HeaderLabel>
          </HeaderContainer>

          <Loading className="loader" loading={ItemReducer.Fetching_Status} />

          <ListTable>
            <Table
              columns={columns}
              bordered
              dataSource={ItemReducer.List.slice((page - 1) * 25, page * 25)}
              pagination={false}
              rowKey={record => record.id}
            />
          </ListTable>

          <PaginationContainer>
            <PaginationList
              defaultPageSize={25}
              total={ItemReducer.List.length}
              onChange={page => this.setState({ page })}
            />
          </PaginationContainer>
        </Container>
      </ListContainer>
    );
  }
}

List.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);
  }
  // await ctx.reduxStore.dispatch({ type: actionTypes.ITEM.RESET });
  return { auth };
};

export default connect(
  ({ ItemReducer }) => ({ ItemReducer }),
  { GetItem, ClearItem }
)(List);

const Container = styled.div`
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  background: #f5f6f5;
`;

const ListTable = styled.div`
  height: calc(90vh - 32px);
  overflow-y: auto;

  tbody[class*="ant-table-tbody"] {
    background: white;
  }
`;

const Loading = styled.div`
  display: ${props => (props.loading ? "block" : "none")};
`;

const HeaderContainer = styled.div`
  padding: 10px;
`;

const HeaderLabel = styled.label`
  font-size: 26px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 15px;
`;
