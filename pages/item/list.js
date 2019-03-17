import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItem, ClearItem } from "<actions>";
import { Table, Icon } from "antd";
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
    this.props.ClearItem();
    this.props.GetItem(this.state.page);
  }

  async LoadListMore(page) {
    const { loading } = this.state;
    const { HasMore } = this.props.ItemReducer;
    if (HasMore && page !== 1 && !loading) {
      this.setState({ page, loading: true });
      await this.props.GetItem(page);

      this.setState({ loading: false });
    }
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
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "20%"
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record) => {
          return (
            <Link
              href={{ pathname: "/item/form", query: { id: record.id } }}
              prefetch
            >
              <a onClick={() => this.setState({ loading: true })}>
                <Icon type="snippets" />
              </a>
            </Link>
          );
        }
      }
    ];
    return (
      <ListContainer>
        <Container>
          <H1TextCenter>รายการสินค้า</H1TextCenter>

          <Loading className="loader" loading={this.state.loading} />
          <ListTable loading={this.state.loading}>
            <InfiniteScroll
              pageStart={0}
              loadMore={page => this.LoadListMore(page)}
              useWindow={false}
              threshold={250}
            >
              <Table
                columns={columns}
                dataSource={this.props.ItemReducer.List}
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
`;

const ListTable = styled.div`
  height: calc(90vh - ${props => (props.loading ? "5px" : "0px")});
  overflow-y: auto;
`;

const Loading = styled.div`
  display: ${props => (props.loading ? "block" : "none")};
`;

const H1TextCenter = styled.h1`
  padding: 10px 0px;
  text-align: center;
`;
