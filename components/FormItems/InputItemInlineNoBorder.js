import styled from 'styled-components'
import { Input } from 'antd'

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
      </LabelContainer>
      <InputContainer>
        <InputForm {...field} {...props} border={errors[field.name] ? 'red' : null} />

        <div className="error">{(touched[field.name] && errors[field.name]) || errors[field.name]}</div>
      </InputContainer>
    </FlexContainer>
  )
}

export default InputItem

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
`

const InputContainer = styled.div`
  width: 60%;
`

const InputForm = styled(Input)`
  width: 100%;
  height: 35px;

  border-color: white;
  border-width: 0 0 1px 0;

  padding: 5px 10px;
  box-shadow: none !important;
  border-right: none !important;
  border-bottom: 1px solid #ccc;

  .ant-input:focus {
    border-color: white;
    border-width: 0 0 1px 0;
    box-shadow: none !important;
    border-right: none !important;
    border-bottom: 1px solid #ccc;
  }

  .ant-input:hover {
    border-color: white;
    border-width: 0 0 1px 0;
    box-shadow: none !important;
    border-right: none !important;
    border-bottom: 1px solid #ccc;
  }
`

const LabelContainer = styled.label`
  display: flex;
  align-items: center;
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
`
