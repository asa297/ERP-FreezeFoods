import styled from "styled-components";
import { Input } from "antd";

const InputItem = ({
  label,
  requireStar,
  labelafter,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <FlexContainer>
      <LabelContainer>
        <label>{label}</label>
        {requireStar === "true" ? <LabelRequire>*</LabelRequire> : null}
      </LabelContainer>
      <InputContainer>
        <InputForm
          {...field}
          {...props}
          border={errors[field.name] ? "1px solid red" : null}
        />

        <div className="error">
          {(touched[field.name] && errors[field.name]) || errors[field.name]}
        </div>
      </InputContainer>
    </FlexContainer>
  );
};

export default InputItem;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LabelRequire = styled.div`
  color: red;
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

const InputForm = styled(Input)`
  width: 100%;
  height: 35px;
  border: ${props => props.border || "1px solid #ccc"};

  padding: 5px 15px;
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
