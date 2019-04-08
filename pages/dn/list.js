import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetDN, ClearDN } from "<actions>";
import { Table, Icon } from "antd";
import styled from "styled-components";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroller";
import { DocStatus, ListHeader } from "<components>";
import moment from "moment";

class List extends React.PureComponent {
  state = {
    page: 1,
    loading: false
  };

  componentWillMount() {
    this.props.ClearDN();
    this.props.GetDN(this.state.page);
  }

  async LoadListMore(page) {
    const { loading } = this.state;
    const { HasMore } = this.props.RSReducer;
    if (HasMore && page !== 1 && !loading) {
      this.setState({ page, loading: true });
      await this.props.GetDN(page);

      this.setState({ loading: false });
    }
  }

  render() {
    const columns = [
      {
        title: "รหัสเอกสาร",
        dataIndex: "code",
        width: 150,
        align: "center"
      },
      {
        title: "วันที่",
        dataIndex: "date",
        width: "15%",
        render: (text, record, index) => {
          return <div> {moment(record.date).format("DD/MM/YYYY")}</div>;
        }
      },
      {
        title: "สถานะเอกสาร",
        dataIndex: "status",
        width: "15%",
        render: (text, record, index) => {
          return <DocStatus status={record.status} nomargin={true} />;
        }
      },

      {
        title: "บริษัท",
        dataIndex: "contact_org",
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
              href={{ pathname: "/dn/form", query: { id: record.id } }}
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
          <ListHeader title="รายการใบส่งสินค้า" />
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
                dataSource={this.props.DNReducer.List}
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
  ({ DNReducer }) => ({ DNReducer }),
  { GetDN, ClearDN }
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
