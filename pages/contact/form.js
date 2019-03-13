import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ContactFormSchema } from "<utils>/validatior";
import { InputItemInline, InputTextArea, ActionForm } from "<components>";
import {
  InsertContact,
  GetContactById,
  UpdateContact,
  DeleteContact
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
// import { Router } from "<routes>";
import Router from "next/router";
import { actionTypes } from "<action_types>";

class Form extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillMount() {
    const { formId } = this.props;
    if (formId) this.props.GetContactById(formId);
  }

  setInitialDataForm(formId, { Item }) {
    if (!formId) return {};
    return {
      name: Item.name,
      phone: Item.phone,
      org: Item.org,
      remark: Item.remark,
      address: Item.address
    };
  }

  async OnDelete() {
    const { formId } = this.props;
    const { status } = await this.props.DeleteContact(formId);
    if (status) {
      alert("Delete Done");
      Router.push(`/contact/list`);
    } else {
      alert("fail");
    }
  }

  render() {
    const { ContactReducer, formId } = this.props;

    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>ฟอร์มบริษัท</H1TextCenter>
          <FormContainer>
            <Formik
              initialValues={this.setInitialDataForm(formId, ContactReducer)}
              enableReinitialize={formId ? true : false}
              validationSchema={ContactFormSchema}
              onSubmit={async (values, actions) => {
                this.setState({ loading: true });

                const { status, id } = formId
                  ? await this.props.UpdateContact(formId, values)
                  : await this.props.InsertContact(values);

                if (formId) {
                  alert(status ? "Save Done" : "fail");
                } else {
                  alert(status ? "Add Done" : "fail");
                  if (status) {
                    window.location.href = `/contact/form?id=${id}`;
                  }
                }

                this.setState({ loading: false });
              }}
              render={props => (
                <form onSubmit={props.handleSubmit}>
                  <FlexContainer>
                    <FieldContainer width="100%">
                      <Field
                        label="ชื่อ"
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
                        label="เบอร์โทร"
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
                        label="บริษัท"
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
                      label="ที่อยู่"
                      name="address"
                      component={InputTextArea}
                      value={props.values.address}
                      onChange={e =>
                        props.setFieldValue("address", e.target.value)
                      }
                    />
                  </RemarkContainer>

                  <RemarkContainer>
                    <Field
                      label="หมายเหตุ"
                      name="remark"
                      component={InputTextArea}
                      value={props.values.remark}
                      onChange={e =>
                        props.setFieldValue("remark", e.target.value)
                      }
                    />
                  </RemarkContainer>

                  <FlexCenter>
                    <ActionForm
                      formId={formId}
                      loading={this.state.loading}
                      OnDelete={() => this.OnDelete()}
                    />
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
  let formId;
  const { query } = ctx;
  const { auth } = await authInitialProps(true)(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);

    if (query.id) formId = query.id;
  }
  await ctx.reduxStore.dispatch({ type: actionTypes.CONTACT.RESET });
  return { auth, formId };
};

export default connect(
  ({ ContactReducer }) => ({ ContactReducer }),
  { InsertContact, GetContactById, UpdateContact, DeleteContact }
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
