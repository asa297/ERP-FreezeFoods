import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { DNFormSchema } from "<utils>/validatior";
import {
  InputItem,
  InputTextArea,
  ActionForm,
  InputDateItem,
  SelectOption,
  SelectItem,
  DocStatus
} from "<components>";
import { GetItemDN, GetAllContact, ClearContact, InsertDN } from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import moment from "moment";
import { Table, Input, Modal, Icon } from "antd";
import uuidv4 from "uuid";

const confirm = Modal.confirm;

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: "รหัสสินค้า",
        dataIndex: "item_id",
        width: "10%",
        align: "center"
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            ชื่อสินค้า<LabelRequire>*</LabelRequire>
          </FlexContainer>
        ),
        dataIndex: "item_name",
        width: "20%",
        render: (text, record, index) => {
          return (
            <SelectOption
              data={this.state.Item_Select}
              value={record.item_name}
              onChange={value => this.ChangeItem(value, index)}
              disabled={this.state.status === 2 ? true : false}
              fieldread="value"
            />
          );
        }
      },
      {
        title: "รหัสใบรับของ",
        dataIndex: "rs_code",
        width: "15%"
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
              disabled={this.props.formId ? true : false}
            />
          );
        }
      },
      {
        title: "หน่วยสินค้า",
        dataIndex: "unit_name",
        width: "10%"
      },
      {
        title: "หมายเหตุ",
        dataIndex: "remark",
        width: "15%",
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
      document: {
        code: "####",
        date: moment(),
        status: 0,
        create_by: this.props.auth.user.name,
        remark: "",
        refDocId: 0
      },
      lines: [],
      Item_Select: []
    };
  }

  componentWillMount() {
    const { date } = this.state.document;
    this.props.GetAllContact();
    this.props.GetItemDN(date);
    const { formId, rs } = this.props;
    if (formId) {
      const { document, lines } = rs;
      this.setState({
        document,
        lines
      });
    } else {
      this.AddNewRow();
    }
  }

  componentWillReceiveProps({ RSReducer }) {
    const { List } = RSReducer;
    if (List) {
      const Item_Select = List.map(item => {
        return this.SetItemSelect(item);
      });
      this.setState({ Item_Select });
    }
  }

  componentWillUnmount() {
    this.props.ClearContact();
    //Need to Clear ItemCategory Reducer
  }

  SetItemSelect(item) {
    const {
      id,
      item_id,
      item_name,
      remain_qty,
      rs_id,
      rs_code,
      unit_id,
      unit_name
    } = item;
    return {
      id: item_id,
      name: item_name,
      remain_qty,
      rs_id,
      rs_line_id: id,
      rs_code,
      unit_id,
      unit_name,
      value: `${item_id} : ${item_name} (${rs_code})`
    };
  }

  async OnDelete() {
    const { formId } = this.props;
    const { document, lines } = this.state;

    const data = {
      document,
      lines
    };

    const { status } = await this.props.DeleteRS(formId, { data });
    if (status) {
      alert("Delete Done");
      Router.push(`/dn/list`);
    } else {
      alert("fail");
    }
  }

  AddNewRow() {
    let lines = [...this.state.lines];

    const newRow = {
      id: 0,
      item_id: null,
      item_name: null,
      qty: 0,
      unit_id: null,
      unit_name: null,
      remark: null,
      uuid: uuidv4()
    };
    lines.push(newRow);

    this.setState({ lines });
  }

  DeleteRow(index) {
    let lines = [...this.state.lines];
    let Item_Select = [...this.state.Item_Select];
    const { RSReducer } = this.props;
    const { item_id } = lines[index];
    const item = RSReducer.List.find(item => item.item_id === item_id);
    const newItem = this.SetItemSelect(item);
    Item_Select.unshift(newItem);

    lines.splice(index, 1);

    this.setState({ lines, Item_Select });
  }

  ChangeItem(id, index) {
    let Item_Select = [...this.state.Item_Select];
    let lines = [...this.state.lines];
    const item = Item_Select.find(item => item.id === id);

    lines[index].item_id = item.id;
    lines[index].item_name = item.name;
    lines[index].rs_id = item.rs_id;
    lines[index].rs_line_id = item.rs_line_id;
    lines[index].rs_code = item.rs_code;
    lines[index].unit_id = item.unit_id;
    lines[index].unit_name = item.unit_name;
    lines[index].qty = lines[index].remain_qty = item.remain_qty;

    Item_Select.splice(index, 1);
    this.setState({ lines, Item_Select });
  }

  ChangeQTY(e, index) {
    let lines = [...this.state.lines];
    const newValue = Math.floor(e.target.value);
    if (newValue <= lines[index].remain_qty) {
      lines[index].qty = newValue;
    } else {
      lines[index].qty = lines[index].remain_qty;
    }
    this.setState({ lines });
  }

  ChangeRemark(e, index) {
    let lines = [...this.state.lines];
    lines[index].remark = e.target.value;
    this.setState({ lines });
  }

  onChangeContact(id, props) {
    const contact = this.props.ContactReducer.List.find(
      contact => contact.id === id
    );
    props.setFieldValue("contact", contact);
  }

  ChanegDate(props, e) {
    const binding_this = this;
    confirm({
      title: "ยืนยันการเปลี่ยนวันที่",
      content: "ถ้ายืนยันระบบจะลบรายการทั้งหมดของเอกสารนี้",
      async onOk() {
        props.setFieldValue("date", e);
        await binding_this.setState({ lines: [] });
        binding_this.AddNewRow();
        const newDate = moment(e).format("YYYY-MM-DD");
        binding_this.props.GetItemDN(newDate);
      },
      onCancel() {
        return false;
      }
    });
  }

  async onSubmit(values) {
    const { formId } = this.props;
    let { lines } = this.state;

    const lines_empty = lines.length === 0;

    const qty_empty = lines.find(line => line.qty === 0);

    const item_id_empty = lines.find(line => line.item_id === null);

    if (item_id_empty) {
      alert("item cannot empty");
      return;
    }
    if (lines_empty) {
      alert("lines cannot empty");
      return;
    }
    if (qty_empty) {
      alert("qty cannot empty");
      return;
    }

    this.setState({ loading: true });

    const saveData = {
      document: values,
      lines
    };
    // console.log(saveData);
    const { status, id } = formId
      ? await this.props.UpdateRS(formId, saveData)
      : await this.props.InsertDN(saveData);

    // if (formId) {
    //   alert(status ? "Save Done" : "fail");
    // } else {
    //   alert(status ? "Add Done" : "fail");
    //   if (status) {
    //     window.location.href = `/dn/list`;
    //   }
    // }

    this.setState({ loading: false });
  }

  render() {
    const { formId, ContactReducer } = this.props;
    const { lines, columns, document, loading } = this.state;
    return (
      <MasterContanier>
        <Container>
          <HeaderForm>
            <H1Text>ฟอร์มใบส่งของ</H1Text>
            <DocStatus status={document.status} />
          </HeaderForm>
          <FormContainer>
            <Formik
              initialValues={{
                code: document.code,
                date: document.date,
                create_by: document.create_by,
                remark: document.remark,
                refDocId: document.refDocId
              }}
              enableReinitialize={true}
              validationSchema={DNFormSchema}
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
                    <FieldContainer width="25%">
                      <Field
                        label="รหัส"
                        type="text"
                        name="code"
                        component={InputItem}
                        value={props.values.code}
                        disabled={true}
                        padding={true}
                      />
                    </FieldContainer>
                    <FieldContainer width="25%">
                      <Field
                        label="วันที่"
                        name="date"
                        component={InputDateItem}
                        value={moment(props.values.date)}
                        requireStar="true"
                        onChange={e => this.ChanegDate(props, e)}
                        allowClear={false}
                        disabled={formId ? true : false}
                        onBlur={null}
                      />
                    </FieldContainer>

                    <FieldContainer width="25%">
                      <Field
                        label="โดย"
                        type="text"
                        name="create_by"
                        component={InputItem}
                        value={props.values.create_by}
                        disabled={true}
                        padding={true}
                      />
                    </FieldContainer>

                    <FieldContainer width="25%">
                      <Field
                        label="บริษัท"
                        name="contact"
                        component={SelectItem}
                        value={
                          props.values.contact ? props.values.contact.org : ""
                        }
                        data={ContactReducer.List}
                        onChange={e => this.onChangeContact(e, props)}
                        requireStar="true"
                        fieldread="org"
                      />
                    </FieldContainer>
                  </FlexContainer>

                  <RemarkContainer>
                    <FieldContainer width="50%">
                      <Field
                        label="หมายเหตุ"
                        name="remark"
                        component={InputTextArea}
                        value={props.values.remark}
                        onChange={e =>
                          props.setFieldValue("remark", e.target.value)
                        }
                      />
                    </FieldContainer>
                    <div style={{ paddingLeft: "15px" }} />
                    <FieldContainer width="50%">
                      <Field
                        label="ที่อยู่บริษัท"
                        name="contact_address"
                        component={InputTextArea}
                        value={
                          props.values.contact
                            ? props.values.contact.address
                            : ""
                        }
                        onChange={e =>
                          props.setFieldValue("contact_address", e.target.value)
                        }
                        disabled={true}
                      />
                    </FieldContainer>
                  </RemarkContainer>

                  <TableContainer>
                    <Table
                      columns={columns}
                      dataSource={lines}
                      pagination={false}
                      rowKey={record => record.uuid}
                    />
                  </TableContainer>

                  <FlexCenter>
                    <ActionForm
                      formId={formId}
                      loading={loading}
                      OnDelete={() => this.OnDelete()}
                      DisabledSave={document.status === 2 ? true : false}
                      DisabledAction={document.status === 2}
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
  let rs = {
    document: {},
    lines: []
  };
  const { query } = ctx;
  const { auth } = await authInitialProps(true)(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);

    if (query.id) {
      formId = query.id;
      rs = await ctx.reduxStore.dispatch(GetRSById(formId, ctx));
    } else {
      await ctx.reduxStore.dispatch({ type: actionTypes.PO.RESET });
    }
  }

  return { auth, formId, rs };
};

export default connect(
  ({ RSReducer, ContactReducer }) => ({
    RSReducer,
    ContactReducer
  }),
  {
    GetItemDN,
    GetAllContact,
    ClearContact,
    InsertDN
  }
)(Form);

const MasterContanier = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
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
  display: flex;
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

const TableContainer = styled.div`
  padding-left: 15px;
  padding-top: 10px;
  overflow-y: scroll;
  max-height: 50vh;
`;
