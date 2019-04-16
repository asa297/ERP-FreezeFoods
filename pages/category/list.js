import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItemCategory, CleaerItemCategory } from "<actions>";
import { Table, Icon } from "antd";
import styled from "styled-components";
import Link from "next/link";
import { PaginationList } from "<components>";

class List extends React.PureComponent {
  state = {
    page: 1
  };

  componentWillMount() {
    this.props.CleaerItemCategory();
    this.props.GetItemCategory(this.state.page);
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
        title: "หมวดสินค้า",
        dataIndex: "name",
        width: "60%"
      },

      {
        title: "",
        dataIndex: "",
        render: (text, record) => {
          return (
            <Link
              href={{ pathname: "/category/form", query: { id: record.id } }}
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
    const { ItemCategoryReducer } = this.props;
    console.log(ItemCategoryReducer.List);
    return (
      <ListContainer>
        <Container>
          <HeaderContainer>
            <HeaderLabel>รายการหมวดหมู่สินค้า </HeaderLabel>
          </HeaderContainer>

          <Loading
            className="loader"
            loading={ItemCategoryReducer.Fetching_Status}
          />

          <ListTable>
            <Table
              columns={columns}
              bordered
              dataSource={ItemCategoryReducer.List.slice(
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
              total={ItemCategoryReducer.List.length}
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
  // await ctx.reduxStore.dispatch({ type: actionTypes.CATEGORY.RESET });
  return { auth };
};

export default connect(
  ({ ItemCategoryReducer }) => ({ ItemCategoryReducer }),
  { GetItemCategory, CleaerItemCategory }
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
