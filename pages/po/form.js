import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { POFormSchema } from "<utils>/validatior";
import {
  InputItemInline,
  InputTextArea,
  ActionForm,
  InputDateItem,
  SelectOption,
  DocStatus
} from "<components>";
import {
  InsertPO,
  GetPOById,
  DeletePO,
  UpdatePO,
  GetAllItem,
  GetAllItemUnit,
  ClearItem,
  ClearItemUnit
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import moment from "moment";
import { Table, Input, Icon, Modal } from "antd";
import uuidv4 from "uuid";

const Search = Input.Search;

const confirm = Modal.confirm;

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            รหัสสินค้า<LabelRequire>*</LabelRequire>
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
              disabled={this.state.status === 2 ? true : false}
            />
          );
        }
      },
      {
        title: "ชื่อสินค้า",
        dataIndex: "item_name",
        width: "20%"
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            จำนวน<LabelRequire>*</LabelRequire>
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
              disabled={this.state.status === 2 ? true : false}
            />
          );
        }
      },
      {
        title: "ราคาต่อหน่วย",
        dataIndex: "unit_price",
        width: "10%",
        render: (text, record, index) => {
          return (
            <Input
              type="number"
              value={record.unit_price}
              onChange={value => this.ChangeUnitPrice(value, index)}
              disabled={this.state.status === 2 ? true : false}
            />
          );
        }
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            หน่วยสินค้า<LabelRequire>*</LabelRequire>
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
              disabled={this.state.status === 2 ? true : false}
            />
          );
        }
      },
      {
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "20%",
        render: (text, record, index) => {
          return (
            <Input
              type="text"
              value={record.remark}
              onChange={value => this.ChangeRemark(value, index)}
              disabled={this.state.status === 2 ? true : false}
            />
          );
        }
      },
      {
        title: "",
        dataIndex: "",
        width: "10%",
        render: (text, record, index) => {
          if (this.state.status === 2) return;
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
      status: 0,
      document: {
        code: "####",
        date: moment(),
        create_by: this.props.auth.user.name
      },

      data: [
        {
          id: 0,
          item_id: null,
          item_name: null,
          qty: 0,
          unit_price: 0,
          unit_id: null,
          unit_name: null,
          remark: null,
          uuid: uuidv4()
        }
      ],
      deleted_data: []
    };
  }

  componentWillMount() {
    const { formId } = this.props;
    this.props.GetAllItem();
    this.props.GetAllItemUnit();
    if (formId) {
      const { document, lines } = this.props.request;
      this.setState({ document, data: lines, status: document.status });
    }
  }

  componentWillReceiveProps({ formId, request, auth }) {
    if (!formId) {
      let [data, deleted_data] = [...this.state.data, this.state.deleted_data];
      data = [
        {
          id: 0,
          item_id: null,
          item_name: null,
          qty: 0,
          unit_price: 0,
          unit_id: null,
          unit_name: null,
          remark: null,
          uuid: uuidv4()
        }
      ];
      deleted_data = [];

      this.setState({
        document: {
          code: "####",
          date: moment(),
          create_by: auth.user.name,
          remark: null
        },
        data,
        deleted_data,
        status: 0
      });
    } else {
      const { document, lines } = request;
      this.setState({
        document,
        data: lines,
        deleted_data: [],
        status: document.status
      });
    }
  }
  componentWillUnmount() {
    this.props.ClearItem();
    this.props.ClearItemUnit();
  }

  async OnDelete() {
    const { formId } = this.props;
    const { status } = await this.props.DeletePO(formId);
    if (status) {
      alert("Delete Done");
      Router.push(`/po/list`);
    } else {
      alert("fail");
    }
  }

  AddNewRow() {
    const { data } = this.state;

    const newRow = {
      id: 0,
      item_id: null,
      item_name: null,
      qty: 0,
      unit_price: 0,
      unit_id: null,
      unit_name: null,
      remark: null,
      uuid: uuidv4()
    };
    this.setState({ data: [...data, ...[newRow]] });
  }

  DeleteRow(index) {
    let data = [...this.state.data];
    const deleted_data = data[index];

    data.splice(index, 1);

    if (deleted_data.id !== 0) {
      let deleted_data_state = [...this.state.deleted_data];
      deleted_data_state.push(deleted_data);
      this.setState({ deleted_data: deleted_data_state });
    }

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

  async onSubmit(values) {
    const { formId } = this.props;
    const { data, deleted_data } = this.state;

    const item_code_empty = data.find(line => line.item_id === null);
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
      lines: data,
      deleted_data
    };
    const { status, id } = formId
      ? await this.props.UpdatePO(formId, saveData)
      : await this.props.InsertPO(saveData);

    if (formId) {
      alert(status ? "Save Done" : "fail");
    } else {
      alert(status ? "Add Done" : "fail");
      if (status) {
        window.location.href = `/po/form?id=${id}`;
      }
    }

    this.setState({ loading: false });
  }

  render() {
    const { formId } = this.props;

    return (
      <MasterContanier>
        <Container>
          <HeaderForm>
            <H1Text>ฟอร์มใบสั่งซื้อ</H1Text>
            <DocStatus status={this.state.status} />
          </HeaderForm>
          <Search
            placeholder="input search text"
            onSearch={value => console.log(value)}
            style={{ width: "100%" }}
          />
          <FormContainer>
            <Formik
              initialValues={{
                code: this.state.document.code,
                date: this.state.document.date,
                create_by: this.state.document.create_by,
                remark: this.state.document.remark
              }}
              enableReinitialize={true}
              validationSchema={POFormSchema}
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
                    <FieldContainer width="40%">
                      <Field
                        label="รหัส"
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
                        label="วันที่"
                        name="date"
                        component={InputDateItem}
                        value={moment(props.values.date)}
                        requireStar="true"
                        onChange={e => props.setFieldValue("date", e)}
                        allowClear={false}
                        disabled={formId ? true : false}
                      />
                    </FieldContainer>

                    <FieldContainer width="30%">
                      <Field
                        label="โดย"
                        type="text"
                        name="create_by"
                        component={InputItemInline}
                        value={props.values.create_by}
                        requireStar="true"
                        disabled={true}
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

                  <div style={{ paddingLeft: "15px", paddingTop: "10px" }}>
                    <Table
                      columns={this.state.columns}
                      dataSource={this.state.data}
                      pagination={false}
                      rowKey={record => record.uuid}
                    />
                  </div>

                  <FlexCenter>
                    <ActionForm
                      formId={formId}
                      loading={this.state.loading}
                      OnDelete={() => this.OnDelete()}
                      DisabledSave={this.state.status === 2 ? true : false}
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
  let request = {
    document: {},
    lines: []
  };
  const { query } = ctx;
  const { auth } = await authInitialProps(true)(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);

    if (query.id) {
      formId = query.id;
      request = await ctx.reduxStore.dispatch(GetPOById(formId, ctx));
    } else {
      await ctx.reduxStore.dispatch({ type: actionTypes.REQUEST.RESET });
    }
  }

  return { auth, formId, request };
};

export default connect(
  ({ ItemReducer, ItemUnitReducer }) => ({
    ItemReducer,
    ItemUnitReducer
  }),
  {
    InsertPO,
    DeletePO,
    UpdatePO,
    GetAllItem,
    GetAllItemUnit,
    ClearItem,
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

const H1Text = styled.h1`
  margin: 0px;
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

const HeaderForm = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
  align-items: center;
`;
