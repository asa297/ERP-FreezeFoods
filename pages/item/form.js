import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemFormSchema } from "<utils>/validatior";
import { InputItemInline, InputTextArea, SelectItem } from "<components>";
import { InsertItem, GetItemCategory } from "<actions>";
import { Formik, Field } from "formik";
import { Button } from "antd";
import styled from "styled-components";

class Form extends React.PureComponent {
  state = {
    loading: false
  };

  componentWillMount() {
    this.props.GetItemCategory();
  }

  onChangeItemCategory(id, props) {
    const itemcategory = this.props.ItemCategoryReducer.find(
      category => category.id === id
    );
    props.setFieldValue("category", itemcategory);
  }

  render() {
    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>Item Form</H1TextCenter>
          <FormContainer>
            <Formik
              validationSchema={ItemFormSchema}
              onSubmit={async (values, actions) => {
                this.setState({ loading: true });

                console.log(values);
                const { status } = await this.props.InsertItem(values);

                if (status) {
                  alert("done");
                } else {
                  alert("fail");
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
                        data={this.props.ItemCategoryReducer}
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
  ({ ItemCategoryReducer }) => ({ ItemCategoryReducer }),
  { InsertItem, GetItemCategory }
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
