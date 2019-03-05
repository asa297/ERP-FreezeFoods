import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ContactFormSchema } from "<utils>/validatior";
import { InputItemInline, InputTextArea } from "<components>";
import { InsertContact } from "<actions>";
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
          <H1TextCenter>Contact Form</H1TextCenter>
          <FormContainer>
            <Formik
              validationSchema={ContactFormSchema}
              onSubmit={async (values, actions) => {
                this.setState({ loading: true });
                const { status } = await this.props.InsertContact(values);

                if (status) {
                  alert("done");
                } else {
                  alert("fail");
                }

                this.setState({ loading: false });
                // console.log(values);
              }}
              render={props => (
                <form onSubmit={props.handleSubmit}>
                  <FlexContainer>
                    <FieldContainer width="100%">
                      <Field
                        label="Name"
                        type="text"
                        name="name"
                        component={InputItemInline}
                        value={props.values.name}
                        requireStar="true"
                        onChange={e =>
                          props.setFieldValue("name", e.target.value)
                        }
                      />
                    </FieldContainer>

                    <FieldContainer width="100%">
                      <Field
                        label="Phone"
                        type="text"
                        name="phone"
                        component={InputItemInline}
                        value={props.values.phone}
                        requireStar="true"
                        onChange={e =>
                          props.setFieldValue("phone", e.target.value)
                        }
                      />
                    </FieldContainer>

                    <FieldContainer width="100%">
                      <Field
                        label="Org"
                        type="text"
                        name="org"
                        component={InputItemInline}
                        value={props.values.org}
                        requireStar="true"
                        onChange={e =>
                          props.setFieldValue("org", e.target.value)
                        }
                      />
                    </FieldContainer>
                  </FlexContainer>

                  <RemarkContainer>
                    <Field
                      label="Remark"
                      name="remark"
                      component={InputTextArea}
                      value={props.values.remark}
                      onChange={e =>
                        props.setFieldValue("remark", e.target.value)
                      }
                    />
                  </RemarkContainer>

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
  { InsertContact }
)(Form);

const MasterContanier = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 5%;
`;
const Container = styled.div`
  width: 80%;
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

const FlexContainer = styled.div`
  display: flex;
`;

const FieldContainer = styled.div`
  width: ${props => ` ${props.width}` || ""};
`;

const RemarkContainer = styled.div`
  padding-left: 15px;
`;
