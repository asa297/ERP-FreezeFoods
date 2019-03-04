import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { ItemCategoryFormSchema } from "<utils>/validatior";
import { InputItemInline } from "<components>";
import { InsertItemCategory } from "<actions>";
import { Formik, Field } from "formik";
import { Button } from "antd";
import styled from "styled-components";

class Test extends React.PureComponent {
  state = {
    loading: false
  };

  render() {
    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>Item Category Form</H1TextCenter>
          <FormContainer>
            <Formik
              initialValues={{
                name: ""
              }}
              validationSchema={ItemCategoryFormSchema}
              onSubmit={async (values, actions) => {
                this.setState({ loading: true });
                const { status } = await this.props.InsertItemCategory(values);

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
                  <Field
                    label="Item Category Name"
                    type="text"
                    name="name"
                    component={InputItemInline}
                    inline="true"
                    value={props.values.name}
                    requireStar="true"
                    onChange={e => props.setFieldValue("name", e.target.value)}
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

Test.getInitialProps = async ctx => {
  const { auth } = await authInitialProps(true)(ctx);

  return { auth };
};

export default connect(
  null,
  { InsertItemCategory }
)(Test);

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
