import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItemUnit, ClearItemUnit } from "<actions>";
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
    this.props.ClearItemUnit();
    this.props.GetItemUnit(this.state.page);
  }

  render() {
    const columns = [
      {
        title: "รหัส",
        dataIndex: "id",
        width: 150,
        align: "center"
      },
      {
        title: "หน่วย",
        dataIndex: "name",
        width: "30%"
      },
      {
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "30%"
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record) => {
          return (
            <Link
              href={{ pathname: "/unit/form", query: { id: record.id } }}
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
    const { ItemUnitReducer } = this.props;

    return (
      <ListContainer>
        <Container>
          <HeaderContainer>
            <HeaderLabel>รายการหน่วยสินค้า </HeaderLabel>
          </HeaderContainer>

          <Loading
            className="loader"
            loading={ItemUnitReducer.Fetching_Status}
          />

          <ListTable>
            <Table
              columns={columns}
              bordered
              dataSource={ItemUnitReducer.List.slice(
                (page - 1) * 25,
                page * 25
              )}
              pagination={false}
              rowKey={record => record.id}
            />
          </ListTable>

          <PaginationContainer>
            <PaginationList
              defaultPageSize={25}
              total={ItemUnitReducer.List.length}
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
  // await ctx.reduxStore.dispatch({ type: actionTypes.UNIT.RESET });
  return { auth };
};

export default connect(
  ({ ItemUnitReducer }) => ({ ItemUnitReducer }),
  { GetItemUnit, ClearItemUnit }
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
