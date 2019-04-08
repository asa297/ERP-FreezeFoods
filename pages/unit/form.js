import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemUnitFormSchema } from "<utils>/validatior";
import {
  InputItemInline,
  InputTextAreaInline,
  ActionForm,
  ListHeader
} from "<components>";
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
import { actionTypes } from "<action_types>";
import { Modal } from "antd";

const confirm = Modal.confirm;

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
      alert("ลบเอกสารสำเร็จ");
      Router.push(`/unit/list`);
    } else {
      alert("fail");
    }
  }

  async onSubmit(values) {
    const { formId } = this.props;

    this.setState({ loading: true });

    const { status, id } = formId
      ? await this.props.UpdateItemUnit(formId, values)
      : await this.props.InsertItemUnit(values);

    if (formId) {
      alert(status ? "บันทึกเอกสารสำเร็จ" : "fail");
    } else {
      alert(status ? "เพิ่มเอกสารสำเร็จ" : "fail");
      if (status) {
        window.location.href = `/unit/list`;
      }
    }

    this.setState({ loading: false });
  }

  render() {
    const { ItemUnitReducer, formId } = this.props;

    return (
      <MasterContanier>
        <ListHeader title="ฟอร์มหน่วยสินค้า" icon="file-text" />
        <Container>
          <FormContainer>
            <Formik
              initialValues={this.setInitialDataForm(formId, ItemUnitReducer)}
              enableReinitialize={formId ? true : false}
              validationSchema={ItemUnitFormSchema}
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
                    label="หน่วย"
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
                    label="หมายเหตุ"
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
  // await ctx.reduxStore.dispatch({ type: actionTypes.UNIT.RESET });
  return { auth, formId };
};

export default connect(
  ({ ItemUnitReducer }) => ({ ItemUnitReducer }),
  { InsertItemUnit, GetItemUnitById, UpdateItemUnit, DeleteItemUnit }
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
