import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetContact } from "<actions>";
import { Table } from "antd";
import styled from "styled-components";
// import { Link } from "<routes>";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroller";

class List extends React.PureComponent {
  state = {
    page: 1,
    loading: false
  };

  componentWillMount() {
    this.props.GetContact(this.state.page);
  }

  _onChangePagination(page) {
    this.setState({ page });
  }

  async _onDelete(item) {
    const { id } = item;

    const res = await this.props.DeleteContact(id);

    if (res.status) {
      alert("done");
    } else {
      alert("fail");
    }
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
        title: "Id",
        dataIndex: "id",
        width: 150,
        align: "center"
      },
      {
        title: "Name",
        dataIndex: "name",
        width: "20%"
      },
      {
        title: "phone",
        dataIndex: "phone",
        width: "20%"
      },
      {
        title: "Organization",
        dataIndex: "org",
        width: "20%"
      },
      {
        title: "Remark",
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
              <a onClick={() => this.setState({ loading: true })}>View</a>
            </Link>
          );
        }
      }
    ];

    return (
      <ListContainer>
        <Container>
          <H1TextCenter>Contact List</H1TextCenter>

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

  return { auth };
};

export default connect(
  ({ ContactReducer }) => ({ ContactReducer }),
  { GetContact }
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
