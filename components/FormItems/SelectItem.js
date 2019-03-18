import styled from "styled-components";
import { Select } from "antd";

const Option = Select.Option;

const SelectItem = ({
  label,
  requireStar,
  data = [],
  fieldread,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <Container>
      <FlexContainer>
        <label>{label}</label>
        {requireStar === "true" ? <LabelRequire>*</LabelRequire> : null}
      </FlexContainer>

      <SelectForm
        {...field}
        {...props}
        border={errors[field.name] ? "1px solid red" : null}
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
      </SelectForm>

      <div className="error">
        {(touched[field.name] && errors[field.name]) || errors[field.name]}
      </div>
    </Container>
  );
};

export default SelectItem;

const FlexContainer = styled.div`
  display: flex;
  padding: 5px 0px;
`;

const LabelRequire = styled.div`
  color: red;
`;

const SelectForm = styled(Select)`
  width: 100%;

  .ant-select-selection {
    border: ${props => (props.border ? props.border : "1px solid #d9d9d9")};
  }

  border-radius: 5px;
`;

const Container = styled.div`
  padding-left: 15px;
`;
