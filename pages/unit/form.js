import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemUnitFormSchema } from "<utils>/validatior";
import { InputItemInline, InputTextAreaInline, ActionForm } from "<components>";
import {
  InsertItemUnit,
  GetItemUnitById,
  UpdateItemUnit,
  DeleteItemUnit
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
// import { Router } from "<routes>";
import Router from "next/router";

class Form extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillMount() {
    const { formId } = this.props;
    if (formId) this.props.GetItemUnitById(formId);
  }

  setInitialDataForm(formId, { Item }) {
    if (!formId) return {};
    return {
      name: Item.name,
      remark: Item.remark
    };
  }

  async OnDelete() {
    const { formId } = this.props;
    const { status } = await this.props.DeleteItemUnit(formId);
    if (status) {
      alert("Delete Done");
      Router.push(`/unit/list`);
    } else {
      alert("fail");
    }
  }

  render() {
    const { ItemUnitReducer, formId } = this.props;

    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>Item Unit Form</H1TextCenter>
          <FormContainer>
            <Formik
              initialValues={this.setInitialDataForm(formId, ItemUnitReducer)}
              enableReinitialize={formId ? true : false}
              validationSchema={ItemUnitFormSchema}
              onSubmit={async (values, actions) => {
                this.setState({ loading: true });

                const { status, id } = formId
                  ? await this.props.UpdateItemUnit(formId, values)
                  : await this.props.InsertItemUnit(values);

                if (formId) {
                  alert(status ? "Save Done" : "fail");
                } else {
                  alert(status ? "Add Done" : "fail");
                  if (status) {
                    window.location.href = `/unit/form?id=${id}`;
                  }
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
                    component={InputTextAreaInline}
                    value={props.values.remark}
                    onChange={e =>
                      props.setFieldValue("remark", e.target.value)
                    }
                  />

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
  return { auth, formId };
};

export default connect(
  ({ ItemUnitReducer }) => ({ ItemUnitReducer }),
  { InsertItemUnit, GetItemUnitById, UpdateItemUnit, DeleteItemUnit }
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
