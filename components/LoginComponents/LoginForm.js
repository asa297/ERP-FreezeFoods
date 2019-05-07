import { Formik, Field } from 'formik'
import { Button } from 'antd'
import { InputItemInlineNoBorder, ImageOverlay } from '<components>'
import styled from 'styled-components'
import { loginUser } from '<utils>/auth'
import Router from 'next/router'

const LoginForm = () => {
  return (
    <Contanier>
      <LoginContainer>
        <FormContiner>
          <ImageOverlay />

          <Formik
            initialValues={
              {
                // username: "god",
                // password: "admin"
              }
            }
            onSubmit={(values, actions) => {
              const { username, password } = values
              loginUser(username, password)
                .then(() => {
                  alert('done')
                })
                .catch(() => {
                  alert('fail')
                })
            }}
            render={props => (
              <form style={{ padding: '10px 0' }} onSubmit={props.handleSubmit}>
                <Field
                  label="ผู้ใช้"
                  type="text"
                  name="username"
                  component={InputItemInlineNoBorder}
                  value={props.values.username}
                  requireStar="true"
                  onChange={e => props.setFieldValue('username', e.target.value)}
                />

                <Field
                  label="รหัสผ่าน"
                  type="password"
                  name="password"
                  component={InputItemInlineNoBorder}
                  value={props.values.password}
                  requireStar="true"
                  onChange={e => props.setFieldValue('password', e.target.value)}
                />
                <FlexCenter>
                  <ButtonWrapper htmlType="submit">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>เข้าสู่ระบบ</div>
                  </ButtonWrapper>
                </FlexCenter>
              </form>
            )}
          />
        </FormContiner>
      </LoginContainer>
    </Contanier>
  )
}

export default LoginForm

const Contanier = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`
const LoginContainer = styled.div`
  @media (min-width: 0px) and (max-width: 1200px) {
    width: 60%;
  }

  width: 40%;
`

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const ButtonWrapper = styled(Button)`
  background-color: #73d13d;
  color: white;
  padding: 25px 40px;

  height: 40px;
  padding: 20px 40px;

  border-radius: 40px;

  :hover,
  :active,
  :visited,
  :focus {
    background-color: #73d13d;
    color: white;
  }
`

const FormContiner = styled.div`
  border: 1px solid #ccc;

  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`
