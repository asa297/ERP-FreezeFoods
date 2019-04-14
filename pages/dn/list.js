import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetDN, ClearDN } from "<actions>";
import { Table, Icon } from "antd";
import styled from "styled-components";
import Link from "next/link";
import moment from "moment";
import { DocStatus, PaginationList } from "<components>";

class List extends React.PureComponent {
  state = {
    page: 1
  };

  componentWillMount() {
    this.props.ClearDN();
    this.props.GetDN(this.state.page);
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

    const { page } = this.state;
    const { DNReducer } = this.props;

    return (
      <ListContainer>
        <Container>
          <HeaderContainer>
            <HeaderLabel>รายการใบส่งสินค้า </HeaderLabel>
          </HeaderContainer>

          <Loading className="loader" loading={DNReducer.Fetching_Status} />

          <ListTable>
            <Table
              columns={columns}
              bordered
              dataSource={DNReducer.List.slice((page - 1) * 25, page * 25)}
              pagination={false}
              rowKey={record => record.id}
            />
          </ListTable>

          <PaginationContainer>
            <PaginationList
              defaultPageSize={25}
              total={DNReducer.List.length}
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
