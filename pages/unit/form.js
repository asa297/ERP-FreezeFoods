import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemUnitFormSchema } from "<utils>/validatior";
import { InputItemInline, InputTextArea } from "<components>";
import { InsertItemUnit } from "<actions>";
import { Formik, Field } from "formik";
import { Button } from "antd";
import styled from "styled-components";

class Form extends React.PureComponent {
  state = {
    loading: false
  };

  render() {
    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>Item Unit Form</H1TextCenter>
          <FormContainer>
            <Formik
              initialValues={{
                name: ""
              }}
              validationSchema={ItemUnitFormSchema}
              onSubmit={async (values, actions) => {
                this.setState({ loading: true });
                const { status } = await this.props.InsertItemUnit(values);

                if (status) {
                  alert("done");
                } else {
                  alert("fail");
                }

                this.setState({ loading: false });
              }}
              render={props => (
                <form onSubmit={props.handleSubmit}>
                  <Field
                    label="Item Unit"
                    type="text"
                    name="name"
                    component={InputItemInline}
                    inline="true"
                    value={props.values.name}
                    requireStar="true"
                    onChange={e => props.setFieldValue("name", e.target.value)}
                  />

                  <FormContainer />

                  <Field
                    label="Remark Unit"
                    name="remark"
                    component={InputTextArea}
                    value={props.values.remark}
                    onChange={e =>
                      props.setFieldValue("remark", e.target.value)
                    }
                  />

                  <FlexCenter>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={this.state.loading}
                    >
                      Add
                    </Button>
                  </FlexCenter>
                </form>
              )}
            />
          </FormContainer>
        </Container>
      </MasterContanier>
    );
  }
}

Form.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);
  }

  return { auth };
};

export default connect(
  null,
  { InsertItemUnit }
)(Form);

const MasterContanier = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 5%;
`;
const Container = styled.div`
  width: 60%;
`;

const FormContainer = styled.div`
  padding-top: 10px;
`;

const H1TextCenter = styled.h1`
  text-align: center;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
`;
