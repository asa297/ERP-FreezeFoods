import { Table, Checkbox } from "antd";

const TableComponent = ({
  data,
  onEdit,
  onDelete,
  onChangeCheckBox,
  columns
}) => {
  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default TableComponent;
