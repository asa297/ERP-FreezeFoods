import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { GetItem, DeleteItem } from "<actions>";
import { PaginationList } from "<components>";
import { Table } from "antd";
import styled from "styled-components";
// import Link from "next/link";

import { Link } from "../../routes";

class List extends React.PureComponent {
  state = {
    page: 1
  };

  componentWillMount() {
    this.props.GetItem();
  }

  _onChangePagination(page) {
    this.setState({ page });
  }

  _onEdit(item, status) {
    alert("Next Phase Kub");
    console.log(item);
  }

  async _onDelete(item, status) {
    const { id } = item;

    const res = await this.props.DeleteItem(id);

    if (res.status) {
      alert("done");
    } else {
      alert("fail");
    }
  }

  render() {
    const columns = [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        width: 150,
        align: "center"
      },
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        key: "name"
      },
      {
        title: "Item Cagtegory",
        dataIndex: "item_category_name",
        width: "20%",
        key: "item_category_name"
      },

      {
        title: "Remark",
        dataIndex: "remark",
        width: "20%",
        key: "remark"
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record) => {
          return (
            <div>
              <Link route="item" params={{ id: record.id }} prefetch >
                <a>Edit</a>
              </Link>
              /<a onClick={() => this._onDelete(record)}>Delete</a>
            </div>
          );
        }
      }
    ];

    console.log(this.props);
    return (
      <ListContainer>
        <Container>
          <H1TextCenter>Item List</H1TextCenter>

          <Table
            columns={columns}
            dataSource={this.props.ItemReducer.List.slice(
              (this.state.page - 1) * 10,
              this.state.page * 10
            )}
            pagination={false}
          />

          <PaginationContainer>
            <PaginationList
              defaultPageSize={10}
              total={this.props.ItemReducer.List.length}
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
  ({ ItemReducer }) => ({ ItemReducer }),
  { GetItem, DeleteItem }
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
