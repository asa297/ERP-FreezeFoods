import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemCategoryFormSchema } from "<utils>/validatior";
import { InputItemInline, ActionForm, ListHeader } from "<components>";
import {
  InsertItemCategory,
  GetItemCategoryById,
  UpdateItemCategory,
  DeleteItemCategory
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
// import { Router } from "<routes>";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import { Modal } from "antd";

const confirm = Modal.confirm;

class Form extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillMount() {
    const { formId } = this.props;
    if (formId) this.props.GetItemCategoryById(formId);
  }

  setInitialDataForm(formId, { Item }) {
    if (!formId) return {};
    return {
      name: Item.name
    };
  }

  async OnDelete() {
    const { formId } = this.props;
    const { status } = await this.props.DeleteItemCategory(formId);
    if (status) {
      alert("ลบเอกสารสำเร็จ");
      Router.push(`/category/list`);
    } else {
      alert("fail");
    }
  }

  async onSubmit(values) {
    const { formId } = this.props;

    this.setState({ loading: true });

    const { status, id } = formId
      ? await this.props.UpdateItemCategory(formId, values)
      : await this.props.InsertItemCategory(values);

    if (formId) {
      alert(status ? "บันทึกเอกสารสำเร็จ" : "fail");
    } else {
      alert(status ? "เพิ่มเอกสารสำเร็จ" : "fail");
      if (status) {
        window.location.href = `/category/list`;
      }
    }

    this.setState({ loading: false });
  }

  render() {
    const { ItemCategoryReducer, formId } = this.props;

    return (
      <MasterContanier>
        <ListHeader title="ฟอร์มหมวดสินค้า" icon="file-text" />
        <Container>
          <FormContainer>
            <Formik
              initialValues={this.setInitialDataForm(
                formId,
                ItemCategoryReducer
              )}
              enableReinitialize={formId ? true : false}
              validationSchema={ItemCategoryFormSchema}
              onSubmit={async (values, actions) => {
                const binding_this = this;
                confirm({
                  title: "ยืนยันการบันทึก",
                  content: "",
                  onOk() {
                    binding_this.onSubmit(values);
                  },
                  onCancel() {
                    return false;
                  }
                });
              }}
              render={props => (
                <form>
                  <Field
                    label="หมวดสินค้า"
                    type="text"
                    name="name"
                    component={InputItemInline}
                    inline="true"
                    value={props.values.name}
                    requireStar="true"
                    onChange={e => props.setFieldValue("name", e.target.value)}
                  />

                  <FlexCenter>
                    <ActionForm
                      formId={formId}
                      loading={this.state.loading}
                      OnDelete={() => this.OnDelete()}
                      onSubmit={props.handleSubmit}
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
  await ctx.reduxStore.dispatch({ type: actionTypes.CATEGORY.RESET });
  return { auth, formId };
};

export default connect(
  ({ ItemCategoryReducer }) => ({ ItemCategoryReducer }),
  {
    InsertItemCategory,
    GetItemCategoryById,
    UpdateItemCategory,
    DeleteItemCategory
  }
)(Form);

const MasterContanier = styled.div`
  width: 100%;
`;
const Container = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
`;

const FormContainer = styled.div`
  padding-top: 20px;
  width: 60%;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
`;
