import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { RequestFormSchema } from "<utils>/validatior";
import {
  InputItem,
  InputTextArea,
  ActionForm,
  InputDateItem,
  DocStatus,
  SelectItem,
  ItemSelectionModal,
  ListHeader
} from "<components>";
import {
  InsertRequest,
  GetRequestById,
  DeleteRequest,
  UpdateRequest,
  GetAllItem,
  GetAllContact,
  ClearItem,
  ClearContact
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import moment from "moment";
import { Table, Input, Icon, Modal, Button } from "antd";
import uuidv4 from "uuid";

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
        align: "center"
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
        title: "หน่วยสินค้า",
        dataIndex: "unit_name",
        width: "15%"
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
            <a href="#" onClick={() => this.DeleteRow(index)}>
              <Icon type="minus" />
            </a>
          );
        }
      }
    ];

    this.state = {
      loading: false,
      visible: false,
      columns,
      status: 0,
      document: {
        code: "####",
        date: moment(),
        create_by: this.props.auth.user.name
      },
      data: [],
      deleted_data: []
    };
  }

  componentWillMount() {
    const { formId } = this.props;
    this.props.GetAllItem();
    this.props.GetAllContact();
    if (formId) {
      const { document, lines } = this.props.request;
      this.setState({ document, data: lines, status: document.status });
    }
  }

  componentWillReceiveProps({ formId, request, auth }) {
    if (!formId) {
      this.setState({
        document: {
          code: "####",
          date: moment(),
          create_by: auth.user.name,
          remark: null
        },
        data: [],
        deleted_data: [],
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
    this.props.ClearContact();
  }

  async OnDelete() {
    const { formId } = this.props;
    this.setState({ loading: true });
    const { status } = await this.props.DeleteRequest(formId);
    if (status) {
      alert("ลบเอกสารสำเร็จ");
      Router.push(`/request/list`);
    } else {
      alert("fail");
    }
    this.setState({ loading: false });
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

  ChangeRemark(e, index) {
    let data = [...this.state.data];
    data[index].remark = e.target.value;
    this.setState({ data });
  }

  onChangeContact(id, props) {
    const contact = this.props.ContactReducer.List.find(
      contact => contact.id === id
    );
    props.setFieldValue("contact", contact);
  }

  AddItem(rows) {
    const data = rows.map(row => {
      row.item_id = row.id;
      row.item_name = row.name;
      row.qty = 0;
      row.unit_price = 0;
      row.unit_id = row.item_unit_id;
      row.unit_name = row.item_unit_name;
      row.remark = "";
      row.uuid = uuidv4();
      row.id = 0;

      return row;
    });

    this.setState({ data: [...this.state.data, ...data] });
  }
  async onSubmit(values) {
    const { formId } = this.props;
    const { data, deleted_data } = this.state;

    const qty_empty = data.find(line => line.qty === 0);
    const line_empty = data.length === 0;

    if (qty_empty) {
      alert("จำนวนสินค้าไม่สามารถว่างได้");
      return;
    }
    if (line_empty) {
      alert("รายการสินค้าไม่สามารถว่างได้");
      return;
    }

    this.setState({ loading: true });

    const saveData = {
      document: values,
      lines: data,
      deleted_data
    };

    const { status, id } = formId
      ? await this.props.UpdateRequest(formId, saveData)
      : await this.props.InsertRequest(saveData);

    if (formId) {
      alert(status ? "บันทึกเอกสารสำเร็จ" : "fail");
    } else {
      alert(status ? "เพิ่มเอกสารสำเร็จ" : "fail");
      if (status) {
        window.location.href = `/request/list`;
      }
    }

    this.setState({ loading: false });
  }

  render() {
    const { formId, ContactReducer, ItemReducer } = this.props;
    const { document } = this.state;
    return (
      <MasterContanier>
        <ListHeader
          title="ฟอร์มใบสั่งซื้อ"
          icon="file-text"
          status={document.status}
        />

        <Container>
          <FormContainer>
            <Formik
              initialValues={{
                code: document.code,
                date: document.date,
                create_by: document.create_by,
                remark: document.remark,
                contact: document.contact_id
                  ? {
                      id: document.contact_id,
                      org: document.contact_org
                    }
                  : ""
              }}
              enableReinitialize={true}
              validationSchema={RequestFormSchema}
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
                        requireStar="true"
                        padding={true}
                        disabled={true}
                      />
                    </FieldContainer>
                    <FieldContainer width="25%">
                      <Field
                        label="วันที่"
                        name="date"
                        component={InputDateItem}
                        value={moment(props.values.date)}
                        requireStar="true"
                        onChange={e => props.setFieldValue("date", e)}
                        allowClear={false}
                        disabled={this.state.status === 2 ? true : false}
                      />
                    </FieldContainer>

                    <FieldContainer width="25%">
                      <Field
                        label="โดย"
                        type="text"
                        name="create_by"
                        component={InputItem}
                        value={props.values.create_by}
                        requireStar="true"
                        padding={true}
                        disabled={true}
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
                    <Field
                      label="หมายเหตุ"
                      name="remark"
                      component={InputTextArea}
                      value={props.values.remark}
                      onChange={e =>
                        props.setFieldValue("remark", e.target.value)
                      }
                      disabled={this.state.status === 2 ? true : false}
                    />
                  </RemarkContainer>

                  {this.state.status !== 2 ? (
                    <AddItemButton
                      key="button"
                      onClick={() => this.setState({ visible: true })}
                      icon="plus"
                    >
                      เพิ่มสินค้า
                    </AddItemButton>
                  ) : null}

                  <div
                    style={{
                      paddingLeft: "15px",
                      paddingTop: "10px",
                      overflowY: "scroll",
                      maxHeight: "50vh"
                    }}
                  >
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
                      DisabledAction={this.state.status === 2}
                      onSubmit={props.handleSubmit}
                    />
                  </FlexCenter>
                </form>
              )}
            />
          </FormContainer>
        </Container>
        <ItemSelectionModal
          visible={this.state.visible}
          closemodal={() => this.setState({ visible: false })}
          onSubmit={value => this.AddItem(value)}
          data={ItemReducer.List}
        />
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
      request = await ctx.reduxStore.dispatch(GetRequestById(formId, ctx));
    } else {
      await ctx.reduxStore.dispatch({ type: actionTypes.REQUEST.RESET });
    }
  }

  return { auth, formId, request };
};

export default connect(
  ({ ItemReducer, ContactReducer }) => ({
    ItemReducer,
    ContactReducer
  }),
  {
    InsertRequest,
    DeleteRequest,
    UpdateRequest,
    GetAllItem,
    GetAllContact,
    ClearContact,
    ClearItem
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
  width: 80%;
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

const AddItemButton = styled(Button)`
  margin: 5px 0px 0px 15px;
`;
