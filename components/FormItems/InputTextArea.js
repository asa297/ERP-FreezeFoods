import styled from "styled-components";
import { Input } from "antd";

const { TextArea } = Input;

const InputTextArea = ({
  label,
  requireStar,
  labelafter,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <div>
      <FlexContainer>
        <label>{label}</label>
        {requireStar === "true" ? <LabelRequire>*</LabelRequire> : null}
      </FlexContainer>
      <TextAreaForm
        {...field}
        {...props}
        border={errors[field.name] ? "1px solid red" : null}
      />
      <div className="error">
        {(touched[field.name] && errors[field.name]) || errors[field.name]}
      </div>
    </div>
  );
};

export default InputTextArea;

const FlexContainer = styled.div`
  display: flex;
  padding: 5px 0px;
`;

const LabelRequire = styled.div`
  color: red;
`;

const InputContainer = styled.div`
  margin-left: 10px;
  width: 100%;
`;

const TextAreaForm = styled(TextArea)`
  width: 100%;
  height: 35px;
  border: ${props => props.border || "1px solid #ccc"};
  padding: 5px 15px;
`;

const LabelContainer = styled.label`
  display: flex;
  padding: 5px 15px;
  white-space: nowrap;
  width: 10%;
`;
