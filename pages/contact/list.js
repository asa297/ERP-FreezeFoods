import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetContact, ClearContact } from "<actions>";
import { Table, Icon } from "antd";
import styled from "styled-components";
// import { Link } from "<routes>";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroller";
import { actionTypes } from "<action_types>";
import { ListHeader } from "<components>";

class List extends React.PureComponent {
  state = {
    page: 1,
    loading: false
  };

  componentWillMount() {
    this.props.ClearContact();
    this.props.GetContact(this.state.page);
  }

  _onChangePagination(page) {
    this.setState({ page });
  }

  async LoadListMore(page) {
    const { loading } = this.state;
    const { HasMore } = this.props.ContactReducer;
    if (HasMore && page !== 1 && !loading) {
      this.setState({ page, loading: true });
      await this.props.GetContact(page);

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
        title: "เบอร์โทร",
        dataIndex: "phone",
        width: "20%"
      },
      {
        title: "บริษัท",
        dataIndex: "org",
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
              href={{ pathname: "/contact/form", query: { id: record.id } }}
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

    return (
      <ListContainer>
        <Container>
          <ListHeader title="รายการบริษัท" />
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
                dataSource={this.props.ContactReducer.List}
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
  // await ctx.reduxStore.dispatch({ type: actionTypes.CONTACT.RESET });
  return { auth };
};

export default connect(
  ({ ContactReducer }) => ({ ContactReducer }),
  { GetContact, ClearContact }
)(List);

const Container = styled.div`
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  background: #faf6d0;
`;

const ListTable = styled.div`
  height: calc(90vh - ${props => (props.loading ? "5px" : "0px")});
  overflow-y: auto;

  tbody[class*="ant-table-tbody"] {
    background: white;
  }
`;

const Loading = styled.div`
  display: ${props => (props.loading ? "block" : "none")};
`;
