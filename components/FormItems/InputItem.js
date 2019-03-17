import styled from "styled-components";
import { Input } from "antd";

const InputItem = ({
  label,
  requireStar,
  labelafter,
  padding,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <Container padding={padding}>
      <FlexContainer>
        <label>{label}</label>
        {requireStar === "true" ? <LabelRequire>*</LabelRequire> : null}
      </FlexContainer>
      <InputForm
        {...field}
        {...props}
        border={errors[field.name] ? "1px solid red" : null}
      />
      <div className="error">
        {(touched[field.name] && errors[field.name]) || errors[field.name]}
      </div>
    </Container>
  );
};

export default InputItem;

const FlexContainer = styled.div`
  display: flex;
  padding: 5px 0px;
`;

const LabelRequire = styled.div`
  color: red;
`;

const InputForm = styled(Input)`
  width: 100%;
  height: 35px;
  border: ${props => props.border || "1px solid #ccc"};
  padding: 5px 15px;
`;

const Container = styled.div`
  padding-left: ${props => (props.padding ? "15px" : "0px")};
`;
