import { Select, Form } from "antd";

const Option = Select.Option;

const SelectOption = ({ data = [], fieldread = "name", ...props }) => {
  return (
    <Select
      {...props}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {data.map(item => {
        return (
          <Option key={item.id} value={item.id}>
            {item[fieldread]}
          </Option>
        );
      })}
    </Select>
  );
};

export default SelectOption;
