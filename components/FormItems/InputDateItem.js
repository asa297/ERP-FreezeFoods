import styled from "styled-components";
import { DatePicker } from "antd";

const InputDateItem = ({
  label,
  requireStar,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <div>
      <FlexContainer>
        <LabelContainer>
          <label>{label}</label>
          {requireStar === "true" ? <LabelRequire>*</LabelRequire> : null}
        </LabelContainer>
        <InputContainer>
          <DatePickerForm
            {...field}
            {...props}
            // border={errors[field.name] ? "1px solid red" : null}
            border={errors[field.name] ? true : false}
          />
          <div className="error">
            {(touched[field.name] && errors[field.name]) || errors[field.name]}
          </div>
        </InputContainer>
      </FlexContainer>
    </div>
  );
};

export default InputDateItem;

const FlexContainer = styled.div`
  display: flex;
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

const InputContainer = styled.div`
  margin-left: 10px;

  @media (min-width: 768px) and (max-width: 1170px) {
    width: 75%;
  }

  @media (min-width: 1170px) and (max-width: 1600px) {
    width: 80%;
  }

  @media (min-width: 1600px) {
    width: 90%;
  }
`;

const LabelContainer = styled.label`
  display: flex;
  padding: 5px 15px;
  white-space: nowrap;

  @media (min-width: 768px) and (max-width: 1170px) {
    width: 20%;
  }

  @media (min-width: 1170px) and (max-width: 1600px) {
    width: 15%;
  }

  @media (min-width: 1600px) {
    width: 15%;
  }
`;
