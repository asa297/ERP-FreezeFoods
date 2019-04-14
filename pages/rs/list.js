import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetRS, ClearRS } from "<actions>";
import { Table, Icon } from "antd";
import styled from "styled-components";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroller";
import { DocStatus, PaginationList } from "<components>";
import moment from "moment";

class List extends React.PureComponent {
  state = {
    page: 1
  };

  componentWillMount() {
    this.props.ClearRS();
    this.props.GetRS(this.state.page);
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
        title: "ผู้สร้าง",
        dataIndex: "create_by",
        width: "20%"
      },

      {
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "20%"
      },
      { title: "ใบสั่งซื้อ", dataIndex: "po_code", width: "15%" },
      {
        title: "",
        dataIndex: "",
        render: (text, record) => {
          return (
            <Link
              href={{ pathname: "/rs/form", query: { id: record.id } }}
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
    const { RSReducer } = this.props;

    return (
      <ListContainer>
        <Container>
          <HeaderContainer>
            <HeaderLabel>รายการใบรับสินค้า </HeaderLabel>
          </HeaderContainer>

          <Loading className="loader" loading={RSReducer.Fetching_Status} />

          <ListTable>
            <Table
              columns={columns}
              bordered
              dataSource={RSReducer.List.slice((page - 1) * 25, page * 25)}
              pagination={false}
              rowKey={record => record.id}
            />
          </ListTable>

          <PaginationContainer>
            <PaginationList
              defaultPageSize={25}
              total={RSReducer.List.length}
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
  return { auth };
};

export default connect(
  ({ RSReducer }) => ({ RSReducer }),
  { GetRS, ClearRS }
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
