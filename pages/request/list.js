import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItemUnit, DeleteItemUnit } from "<actions>";
import { PaginationList } from "<components>";
import { Table } from "antd";
import styled from "styled-components";
// import { Link } from "<routes>";
import Link from "next/link";

class List extends React.PureComponent {
  state = {
    page: 1
  };

  componentWillMount() {
    this.props.GetItemUnit();
  }

  _onChangePagination(page) {
    this.setState({ page });
  }

  async _onDelete(item) {
    const { id } = item;

    const res = await this.props.DeleteItemUnit(id);

    if (res.status) {
      alert("done");
    } else {
      alert("fail");
    }
  }

  render() {
    const columns = [
      {
        title: "Code",
        dataIndex: "id",
        width: 150,
        align: "center"
      },
      {
        title: "Status",
        dataIndex: "status",
        width: "30%"
      },

      {
        title: "Remark",
        dataIndex: "remark",
        width: "30%"
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record) => {
          return (
            <div>
              <Link
                href={{ pathname: "/unit/form", query: { id: record.id } }}
                prefetch
              >
                <a>View</a>
              </Link>
              /<a onClick={() => this._onDelete(record)}>Delete</a>
            </div>
          );
        }
      }
    ];

    return (
      <ListContainer>
        <Container>
          <H1TextCenter>Request List</H1TextCenter>

          <Table
            columns={columns}
            dataSource={this.props.ItemUnitReducer.List.slice(
              (this.state.page - 1) * 10,
              this.state.page * 10
            )}
            pagination={false}
            rowKey={record => record.id}
          />

          <PaginationContainer>
            <PaginationList
              defaultPageSize={10}
              total={this.props.ItemUnitReducer.List.length}
              onChange={page => this._onChangePagination(page)}
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
  ({ ItemUnitReducer }) => ({ ItemUnitReducer }),
  { GetItemUnit, DeleteItemUnit }
)(List);

const Container = styled.div`
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 10px;
`;

const H1TextCenter = styled.h1`
  padding: 10px 0px;
  text-align: center;
`;
