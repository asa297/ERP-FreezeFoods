import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemFormSchema } from "<utils>/validatior";
import { InputItem, InputTextArea, SelectItem, ActionForm } from "<components>";
import {
  InsertItem,
  GetItemCategoryAll,
  GetAllItemUnit,
  GetItemById,
  UpdateItem,
  DeleteItem,
  CleaerItemCategory,
  ClearItemUnit
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import { Router } from "<routes>";
import { actionTypes } from "<action_types>";
import { Modal } from "antd";

const confirm = Modal.confirm;

class Form extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillMount() {
    const { formId } = this.props;
    this.props.GetItemCategoryAll();
    this.props.GetAllItemUnit();
    if (formId) this.props.GetItemById(formId);
  }

  onChangeItemCategory(id, props) {
    const itemcategory = this.props.ItemCategoryReducer.List.find(
      category => category.id === id
    );
    props.setFieldValue("category", itemcategory);
  }

  onChangeItemUnit(id, props) {
    const itemunit = this.props.ItemUnitReducer.List.find(
      unit => unit.id === id
    );
    props.setFieldValue("unit", itemunit);
  }

  setInitialDataForm(formId, { Item }) {
    if (!formId) return {};
    return {
      name: Item.name,
      remark: Item.remark,
      category: {
        id: Item.item_category_id,
        name: Item.item_category_name
      },
      unit: {
        id: Item.item_unit_id,
        name: Item.item_unit_name
      }
    };
  }

  componentWillUnmount() {
    this.props.CleaerItemCategory();
    this.props.ClearItemUnit();
    //Need to Clear ItemCategory Reducer
  }
  async OnDelete() {
    const { formId } = this.props;
    const { status } = await this.props.DeleteItem(formId);
    if (status) {
      alert("Delete Done");
      Router.push(`/item/list`);
    } else {
      alert("fail");
    }
  }

  async onSubmit(values) {
    const { formId } = this.props;

    this.setState({ loading: true });

    const { status, id } = formId
      ? await this.props.UpdateItem(formId, values)
      : await this.props.InsertItem(values);

    if (formId) {
      alert(status ? "Save Done" : "fail");
    } else {
      alert(status ? "Add Done" : "fail");
      if (status) {
        window.location.href = `/item/list`;
      }
    }

    this.setState({ loading: false });
  }

  render() {
    const {
      ItemCategoryReducer,
      ItemReducer,
      ItemUnitReducer,
      formId
    } = this.props;
    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>ฟอร์มสินค้า</H1TextCenter>
          <FormContainer>
            <Formik
              initialValues={this.setInitialDataForm(formId, ItemReducer)}
              enableReinitialize={formId ? true : false}
              validationSchema={ItemFormSchema}
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
                  <FlexContainer>
                    <FieldContainer width="30%">
                      <Field
                        label="ชื่อ"
                        type="text"
                        name="name"
                        component={InputItem}
                        value={props.values.name}
                        requireStar="true"
                        padding={true}
                        onChange={e =>
                          props.setFieldValue("name", e.target.value)
                        }
                      />
                    </FieldContainer>

                    <FieldContainer width="35%">
                      <Field
                        label="หมวดสินค้า"
                        name="category"
                        component={SelectItem}
                        value={
                          props.values.category
                            ? props.values.category.name
                            : ""
                        }
                        requireStar="true"
                        data={ItemCategoryReducer.List}
                        onChange={e => this.onChangeItemCategory(e, props)}
                        fieldread="name"
                      />
                    </FieldContainer>

                    <FieldContainer width="35%">
                      <Field
                        label="หน่วยสินค้า"
                        name="unit"
                        component={SelectItem}
                        value={props.values.unit ? props.values.unit.name : ""}
                        requireStar="true"
                        data={ItemUnitReducer.List}
                        onChange={e => this.onChangeItemUnit(e, props)}
                        fieldread="name"
                      />
                    </FieldContainer>
                  </FlexContainer>

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

  // await ctx.reduxStore.dispatch({ type: actionTypes.ITEM.RESET });
  return { auth, formId };
};

export default connect(
  ({ ItemCategoryReducer, ItemReducer, ItemUnitReducer }) => ({
    ItemCategoryReducer,
    ItemReducer,
    ItemUnitReducer
  }),
  {
    InsertItem,
    GetItemCategoryAll,
    GetItemById,
    UpdateItem,
    DeleteItem,
    CleaerItemCategory,
    GetAllItemUnit,
    ClearItemUnit
  }
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
