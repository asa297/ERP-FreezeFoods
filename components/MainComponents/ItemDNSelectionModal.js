import { Table, Button, Icon, Modal } from "antd";
import { differenceBy } from "lodash";
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
    align: "center"
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

class ItemDNSelectionModal extends React.PureComponent {
  state = {
    selectedRowKeys: [],
    data_show: []
  };

  componentWillReceiveProps({ visible, data, lines }) {
    if (visible) {
      const data_show = differenceBy(data, lines, "id");
      this.setState({ selectedRowKeys: [], data_show });
    }
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

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
    const { selectedRowKeys, data_show } = this.state;
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
