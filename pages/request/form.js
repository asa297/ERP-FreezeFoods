import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { RequestFormSchema } from "<utils>/validatior";
import {
  InputItemInline,
  InputTextArea,
  ActionForm,
  InputDateItem,
  SelectOption
} from "<components>";
import {
  GetAllItem,
  GetAllItemUnit,
  InsertRequest,
  GetRequestById
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import moment from "moment";
import { Table, Button, Input, Icon, InputNumber } from "antd";

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            Item<LabelRequire>*</LabelRequire>
          </FlexContainer>
        ),
        dataIndex: "item_id",
        width: "15%",
        align: "center",
        render: (text, record, index) => {
          return (
            <SelectOption
              data={this.props.ItemReducer.List}
              value={record.item_id}
              onChange={value => this.ChangeItemCode(value, index)}
            />
          );
        }
      },
      {
        title: "Item Name",
        dataIndex: "item_name",
        width: "20%"
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            QTY<LabelRequire>*</LabelRequire>
          </FlexContainer>
        ),
        dataIndex: "qty",
        width: "10%",
        render: (text, record, index) => {
          return (
            <Input
              type="number"
              value={record.qty}
              onChange={value => this.ChangeQTY(value, index)}
            />
          );
        }
      },
      {
        title: "Unit Price",
        dataIndex: "unit_price",
        width: "10%",
        render: (text, record, index) => {
          return (
            <Input
              type="number"
              value={record.unit_price}
              onChange={value => this.ChangeUnitPrice(value, index)}
            />
          );
        }
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            Unit<LabelRequire>*</LabelRequire>
          </FlexContainer>
        ),
        dataIndex: "unit_name",
        width: "15%",
        render: (text, record, index) => {
          return (
            <SelectOption
              data={this.props.ItemUnitReducer.List}
              value={record.unit_name}
              onChange={value => this.ChangeItemUnit(value, index)}
            />
          );
        }
      },
      {
        title: "Remark",
        dataIndex: "remark",
        width: "20%",
        render: (text, record, index) => {
          return (
            <Input
              type="text"
              value={record.remark}
              onChange={value => this.ChangeRemark(value, index)}
            />
          );
        }
      },
      {
        title: "",
        dataIndex: "",
        width: "10%",
        render: (text, record, index) => {
          return (
            <div>
              <a href="#" onClick={() => this.DeleteRow(index)}>
                <Icon type="minus" />
              </a>
              <a
                href="#"
                onClick={() => this.AddNewRow()}
                style={{ paddingLeft: "5px" }}
              >
                <Icon type="plus" />
              </a>
            </div>
          );
        }
      }
    ];

    this.state = {
      loading: false,
      columns,
      data: [
        {
          id: 0,
          item_id: null,
          item_name: null,
          qty: 0,
          unit_price: 0,
          unit_id: null,
          unit_name: null,
          remark: null
        }
      ]
    };
  }

  componentWillMount() {
    const { formId } = this.props;
    this.props.GetAllItem();
    this.props.GetAllItemUnit();
    if (formId) this.props.GetRequestById(formId);
  }

  componentWillReceiveProps({ RequestReducer }) {
    const {
      Item: { lines = [] }
    } = RequestReducer;
    if (lines.length !== 0) {
      this.setState({ data: lines });
    }
  }

  setInitialDataForm(formId, { Item }) {
    const { auth } = this.props;
    if (!formId)
      return {
        code: "####",
        date: moment(),
        by: auth.user.name
      };

    const { document = {} } = Item;
    return {
      code: document.code,
      date: moment(document.date),
      by: document.create_by,
      remarl: document.remark
    };
  }

  // async OnDelete() {
  //   const { formId } = this.props;
  //   const { status } = await this.props.DeleteContact(formId);
  //   if (status) {
  //     alert("Delete Done");
  //     Router.push(`/contact/list`);
  //   } else {
  //     alert("fail");
  //   }
  // }

  AddNewRow() {
    const { data } = this.state;

    const newRow = {
      id: data.length,
      item_id: null,
      item_name: null,
      qty: 0,
      unit_price: 0,
      unit_id: null,
      unit_name: null,
      remark: null
    };
    this.setState({ data: [...data, ...[newRow]] });
  }

  DeleteRow(index) {
    let data = [...this.state.data];
    data.splice(index, 1);
    this.setState({ data });
  }

  ChangeItemCode(id, index) {
    const { ItemReducer } = this.props;
    const item = ItemReducer.List.find(item => item.id === id);

    let data = [...this.state.data];
    data[index].item_id = item.id;
    data[index].item_name = item.name;
    this.setState({ data });
  }

  ChangeQTY(e, index) {
    let data = [...this.state.data];
    data[index].qty = Math.floor(e.target.value);
    this.setState({ data });
  }

  ChangeUnitPrice(e, index) {
    let data = [...this.state.data];
    data[index].unit_price = e.target.value;
    this.setState({ data });
  }

  ChangeItemUnit(id, index) {
    const { ItemUnitReducer } = this.props;
    const unit = ItemUnitReducer.List.find(unit => unit.id === id);

    let data = [...this.state.data];
    data[index].unit_id = unit.id;
    data[index].unit_name = unit.name;
    this.setState({ data });
  }

  ChangeRemark(e, index) {
    let data = [...this.state.data];
    data[index].remark = e.target.value;
    this.setState({ data });
  }
  render() {
    const { RequestReducer, formId } = this.props;

    return (
      <MasterContanier>
        <Container>
          <H1TextCenter>Request Form</H1TextCenter>
          <FormContainer>
            <Formik
              initialValues={this.setInitialDataForm(formId, RequestReducer)}
              enableReinitialize={formId ? true : false}
              validationSchema={RequestFormSchema}
              onSubmit={async (values, actions) => {
                const { data } = this.state;

                const item_code_empty = data.find(
                  line => line.item_id === null
                );
                const qty_empty = data.find(line => line.qty === 0);
                const unit_empty = data.find(line => line.unit_name === null);
                const line_empty = data.length === 0;

                if (item_code_empty) {
                  alert("item code cannot empty");
                  return;
                }
                if (qty_empty) {
                  alert("qty cannot empty");
                  return;
                }
                if (line_empty) {
                  alert("lines cannot empty");
                  return;
                }
                if (unit_empty) {
                  alert("unit cannot empty");
                  return;
                }

                this.setState({ loading: true });

                const saveData = {
                  document: values,
                  lines: data
                };
                const { status, id } = await this.props.InsertRequest(saveData);

                window.location.href = `/request/form?id=${id}`;

                // const { status, id } = formId

                //   ? await this.props.UpdateContact(formId, values)
                //   : await this.props.InsertContact(values);

                // if (formId) {
                //   alert(status ? "Save Done" : "fail");
                // } else {
                //   alert(status ? "Add Done" : "fail");
                //   if (status) {
                //     window.location.href = `/contact/form?id=${id}`;
                //   }
                // }

                this.setState({ loading: false });
              }}
              render={props => (
                <form onSubmit={props.handleSubmit}>
                  <FlexContainer>
                    <FieldContainer width="40%">
                      <Field
                        label="Code"
                        type="text"
                        name="code"
                        component={InputItemInline}
                        value={props.values.code}
                        requireStar="true"
                        disabled={true}
                      />
                    </FieldContainer>
                    <FieldContainer width="30%">
                      <Field
                        label="Date"
                        name="date"
                        component={InputDateItem}
                        value={props.values.date}
                        requireStar="true"
                        onChange={e => props.setFieldValue("date", e)}
                        allowClear={false}
                        disabled={formId ? true : false}
                      />
                    </FieldContainer>

                    <FieldContainer width="30%">
                      <Field
                        label="By"
                        type="text"
                        name="by"
                        component={InputItemInline}
                        value={props.values.by}
                        requireStar="true"
                        onChange={e =>
                          props.setFieldValue("by", e.target.value)
                        }
                        disabled={true}
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

                  <div style={{ paddingLeft: "15px", paddingTop: "10px" }}>
                    <Table
                      columns={this.state.columns}
                      dataSource={this.state.data}
                      pagination={false}
                      rowKey={record => record.id}
                    />
                  </div>

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
  await ctx.reduxStore.dispatch({ type: actionTypes.REQUEST.RESET });
  return { auth, formId };
};

export default connect(
  ({ ItemReducer, ItemUnitReducer, RequestReducer }) => ({
    ItemReducer,
    ItemUnitReducer,
    RequestReducer
  }),
  { GetAllItem, GetAllItemUnit, InsertRequest, GetRequestById }
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

const LabelRequire = styled.div`
  color: red;
`;
