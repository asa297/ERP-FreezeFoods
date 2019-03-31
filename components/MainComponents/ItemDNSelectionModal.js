import { Table, Button, Icon, Modal } from "antd";
import { differenceBy } from "lodash";
import styled from "styled-components";
import { map, difference } from "lodash";

class ItemDNSelectionModal extends React.PureComponent {
  constructor(props) {
    super(props);

    const columns = [
      {
        title: "รหัสสินค้า",
        dataIndex: "item_id",
        width: "20%",
        align: "center"
      },
      {
        title: "ใบรับของ",
        dataIndex: "rs_code",
        width: "20%",
        align: "center",
        render: (text, record, index) => {
          return (
            <CodeText onClick={() => this.SelectDoc(record.rs_code)}>
              {record.rs_code}
            </CodeText>
          );
        }
      },
      {
        title: "ชื่อสินค้า",
        dataIndex: "item_name",
        width: "20%"
      },

      {
        title: "จำนวนเหลือ",
        dataIndex: "remain_qty",
        width: "20%"
      },
      {
        title: "หน่วยสินค้า",
        dataIndex: "unit_name",
        width: "20%"
      }
    ];

    this.state = {
      selectedRowKeys: [],
      data_show: [],
      columns
    };
  }

  componentWillReceiveProps({ visible, data, lines }) {
    if (visible) {
      const data_show = differenceBy(data, lines, "id");
      this.setState({ selectedRowKeys: [], data_show });
    }
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  SelectDoc(code) {
    const { data_show } = this.state;

    let result = data_show.filter(line => line.rs_code === code);
    result = map(result, "id");

    result = difference(result, this.state.selectedRowKeys);
    let selectedRowKeys = [...this.state.selectedRowKeys, ...result];
    this.setState({ selectedRowKeys });
  }

  AddItem() {
    const { selectedRowKeys } = this.state;
    const { data, onSubmit, closemodal } = this.props;

    const result = selectedRowKeys.map(selectedRows => {
      return { ...data.find(row => row.id === selectedRows) };
    });

    onSubmit(result);
    closemodal();
  }

  render() {
    const { selectedRowKeys, data_show, columns } = this.state;
    const { visible, closemodal } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <Modal
        visible={visible}
        width={700}
        title="เลือกรายการสินค้า"
        onCancel={() => closemodal()}
        footer={[
          <Button key="button" type="primary" onClick={() => this.AddItem()}>
            เพิ่มสินค้า
          </Button>
        ]}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data_show}
          pagination={false}
          scroll={{ y: 300 }}
          rowKey={record => record.id}
        />
      </Modal>
    );
  }
}

export default ItemDNSelectionModal;

const CodeText = styled.div`
  cursor: pointer;
  font-style: italic;
  text-decoration: underline;

  :hover {
    color: red;
  }
`;
