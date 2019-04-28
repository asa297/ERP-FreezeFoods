import { Formik, Field } from 'formik'
import { Button } from 'antd'
import { InputItem, ImageProject } from '<components>'
import styled from 'styled-components'
import { loginUser } from '<utils>/auth'
import Router from 'next/router'

const LoginForm = () => {
  return (
    <Contanier>
      <ImageProject />

      <LoginContainer>
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
            <form onSubmit={props.handleSubmit}>
              <Field
                label="ผู้ใช้"
                type="text"
                name="username"
                component={InputItem}
                value={props.values.username}
                requireStar="true"
                onChange={e => props.setFieldValue('username', e.target.value)}
              />

              <Field
                label="รหัสผ่าน"
                type="password"
                name="password"
                component={InputItem}
                value={props.values.password}
                requireStar="true"
                onChange={e => props.setFieldValue('password', e.target.value)}
              />
              <FlexCenter>
                <Button type="primary" htmlType="submit">
                  เข้าสู่ระบบ
                </Button>
              </FlexCenter>
            </form>
          )}
        />
      </LoginContainer>
    </Contanier>
  )
}

export default LoginForm

const Contanier = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding-top: 5%;
`
const LoginContainer = styled.div`
  width: 60%;
`

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`
