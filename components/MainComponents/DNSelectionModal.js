import { Table, Button, Icon, Modal } from "antd";
import moment from "moment";

class RFQSelectionModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: "รหัสเอกสาร",
        dataIndex: "code",
        width: "15%",
        align: "center"
      },
      {
        title: "วันที่",
        dataIndex: "date",
        width: "20%",
        render: (text, record) => {
          return <span>{moment(record.date).format("YYYY-MM-DD")}</span>;
        }
      },

      {
        title: "บริษัท",
        dataIndex: "contact_org",
        width: "30%"
      },
      {
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "25%"
      },
      {
        title: "",
        dataIndex: "",
        width: "10%",
        render: (text, record) => {
          return (
            <Button
              key="button"
              onClick={() => this.AddItem(record)}
              icon="plus"
            />
          );
        }
      }
    ];

    this.state = {
      columns
    };
  }

  AddItem(record) {
    const { onSelect, closemodal } = this.props;
    onSelect(record);
    closemodal();
  }

  render() {
    const { columns } = this.state;
    const { visible, closemodal, data } = this.props;

    return (
      <Modal
        visible={visible}
        width={700}
        title="รายการใบส่งสินค้า"
        onCancel={() => closemodal()}
        footer={[]}
      >
        <Table
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

export default RFQSelectionModal;
