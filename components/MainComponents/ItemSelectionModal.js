import { Table, Button, Icon, Modal } from "antd";

const columns = [
  {
    title: "รหัสสินค้า",
    dataIndex: "id",
    width: "20%",
    align: "center"
  },
  {
    title: "ชื่อสินค้า",
    dataIndex: "name",
    width: "40%"
  },
  {
    title: "หน่วยสินค้า",
    dataIndex: "item_unit_name",
    width: "40%"
  }
];

class ItemSelectionModal extends React.PureComponent {
  state = {
    selectedRowKeys: []
  };

  componentWillReceiveProps({ visible }) {
    if (visible) {
      this.setState({ selectedRowKeys: [] });
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
    const { selectedRowKeys } = this.state;
    const { visible, closemodal, data, onSubmit } = this.props;
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
          dataSource={data}
          pagination={false}
          scroll={{ y: 300 }}
          rowKey={record => record.id}
        />
      </Modal>
    );
  }
}

export default ItemSelectionModal;
