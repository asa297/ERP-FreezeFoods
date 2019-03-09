import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemFormSchema } from "<utils>/validatior";
import {
  InputItemInline,
  InputTextArea,
  SelectItem,
  ActionForm
} from "<components>";
import {
  InsertItem,
  GetItemCategoryAll,
  GetItemById,
  UpdateItem,
  DeleteItem
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import { Router } from "<routes>";
import { actionTypes } from "<action_types>";

class Form extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillMount() {
    const { formId } = this.props;
    this.props.GetItemCategoryAll();
    if (formId) this.props.GetItemById(formId);
  }

  onChangeItemCategory(id, props) {
    const itemcategory = this.props.ItemCategoryReducer.find(
      category => category.id === id
    );
    props.setFieldValue("category", itemcategory);
  }

  setInitialDataForm(formId, { Item }) {
    if (!formId) return {};
    return {
      name: Item.name,
      remark: Item.remark,
      category: {
        id: Item.item_category_id,
        name: Item.item_category_name
      }
    };
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

  render() {
    const { ItemCategoryReducer, ItemReducer, formId } = this.props;

    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>Item Form</H1TextCenter>
          <FormContainer>
            <Formik
              initialValues={this.setInitialDataForm(formId, ItemReducer)}
              enableReinitialize={formId ? true : false}
              validationSchema={ItemFormSchema}
              onSubmit={async (values, actions) => {
                this.setState({ loading: true });

                const { status, id } = formId
                  ? await this.props.UpdateItem(formId, values)
                  : await this.props.InsertItem(values);

                if (formId) {
                  alert(status ? "Save Done" : "fail");
                } else {
                  alert(status ? "Add Done" : "fail");
                  if (status) {
                    window.location.href = `/item/form?id=${id}`;
                  }
                }

                this.setState({ loading: false });
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
                        label="Category"
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

  await ctx.reduxStore.dispatch({ type: actionTypes.ITEM.RESET });
  return { auth, formId };
};

export default connect(
  ({ ItemCategoryReducer, ItemReducer }) => ({
    ItemCategoryReducer,
    ItemReducer
  }),
  { InsertItem, GetItemCategoryAll, GetItemById, UpdateItem, DeleteItem }
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
