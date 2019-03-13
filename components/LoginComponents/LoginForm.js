import { Formik, Field } from "formik";
import { Button } from "antd";
import { InputItem } from "<components>";
import styled from "styled-components";
import { loginUser } from "<utils>/auth";
import Router from "next/router";

const LoginForm = () => {
  return (
    <Contanier>
      <LoginContainer>
        <H1TextCenter>เข้าสู่ระบบ</H1TextCenter>
        <Formik
          initialValues={{
            username: "god",
            password: "admin"
          }}
          onSubmit={(values, actions) => {
            const { username, password } = values;
            loginUser(username, password)
              .then(() => {
                alert("done");
              })
              .catch(() => {
                alert("fail");
              });
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
                onChange={e => props.setFieldValue("username", e.target.value)}
              />

              <Field
                label="รหัสผ่าน"
                type="password"
                name="password"
                component={InputItem}
                value={props.values.password}
                requireStar="true"
                onChange={e => props.setFieldValue("password", e.target.value)}
              />
              <FlexCenter>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </FlexCenter>
            </form>
          )}
        />
      </LoginContainer>
    </Contanier>
  );
};

export default LoginForm;

const Contanier = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 5%;
`;
const LoginContainer = styled.div`
  width: 60%;
`;

const H1TextCenter = styled.h1`
  text-align: center;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
`;
