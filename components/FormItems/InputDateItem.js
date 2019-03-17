import styled from "styled-components";
import { DatePicker } from "antd";

const InputDateItemInline = ({
  label,
  requireStar,
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

      <DatePickerForm
        {...field}
        {...props}
        // border={errors[field.name] ? "1px solid red" : null}
        border={errors[field.name] ? true : false}
      />
      <div className="error">
        {(touched[field.name] && errors[field.name]) || errors[field.name]}
      </div>
    </Container>
  );
};

export default InputDateItemInline;

const FlexContainer = styled.div`
  display: flex;
  padding: 5px 0px;
`;

const LabelRequire = styled.div`
  color: red;
`;

const DatePickerForm = styled(DatePicker)`
  width: 100%;
  input.ant-input {
    border-color: ${props => (props.border ? "red" : "#ccc")};
  }
`;

const Container = styled.div`
  padding-left: 15px;
`;
