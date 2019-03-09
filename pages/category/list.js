import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItemCategory } from "<actions>";
import { Table } from "antd";
import styled from "styled-components";
// import { Link } from "<routes>";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroller";
import { actionTypes } from "<action_types>";

class List extends React.PureComponent {
  state = {
    page: 1,
    loading: false
  };

  componentWillMount() {
    this.props.GetItemCategory(this.state.page);
  }

  _onChangePagination(page) {
    this.setState({ page });
  }

  async _onDelete(item) {
    const { id } = item;

    const res = await this.props.DeleteItemCategory(id);

    if (res.status) {
      alert("done");
    } else {
      alert("fail");
    }
  }

  async LoadListMore(page) {
    const { loading } = this.state;
    const { HasMore } = this.props.ItemCategoryReducer;

    if (HasMore && page !== 1 && !loading) {
      this.setState({ page, loading: true });
      await this.props.GetItemCategory(page);

      this.setState({ loading: false });
    }
  }

  render() {
    const columns = [
      {
        title: "Id",
        dataIndex: "id",

        width: 150,
        align: "center"
      },
      {
        title: "Name",
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
              <a onClick={() => this.setState({ loading: true })}>View</a>
            </Link>
          );
        }
      }
    ];

    return (
      <ListContainer>
        <Container>
          <H1TextCenter>Item Category List</H1TextCenter>
          <Loading className="loader" loading={this.state.loading} />
          <ListTable loading={this.state.loading}>
            <InfiniteScroll
              pageStart={0}
              loadMore={page => this.LoadListMore(page)}
              hasMore={true}
              useWindow={false}
              threshold={250}
            >
              <Table
                columns={columns}
                dataSource={this.props.ItemCategoryReducer.List}
                pagination={false}
                rowKey={record => record.id}
              />
            </InfiniteScroll>
          </ListTable>
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
  await ctx.reduxStore.dispatch({ type: actionTypes.CATEGORY.RESET });
  return { auth };
};

export default connect(
  ({ ItemCategoryReducer }) => ({ ItemCategoryReducer }),
  { GetItemCategory }
)(List);

const Container = styled.div`
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ListTable = styled.div`
  height: calc(90vh - ${props => (props.loading ? "5px" : "0px")});
  overflow-y: auto;
`;

const Loading = styled.div`
  display: ${props => (props.loading ? "block" : "none")};
`;

const H1TextCenter = styled.h1`
  height: 10vh;
  margin: 0px;
  padding: 10px 0px;
  text-align: center;
`;
