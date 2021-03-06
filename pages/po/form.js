import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { POFormSchema } from "<utils>/validatior";
import {
  InputItem,
  InputTextArea,
  ActionForm,
  InputDateItem,
  DocStatus,
  RFQSelectionModal,
  ListHeader
} from "<components>";
import {
  InsertPO,
  UpdatePO,
  GetPOById,
  DeletePO,
  GetRequestReadyToUse,
  GetRequestById,
  ClearRequest
} from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import moment from "moment";
import { Table, Input, Icon, Modal, Button } from "antd";
import uuidv4 from "uuid";
import { isEmpty } from "lodash";

const confirm = Modal.confirm;

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: "รหัสสินค้า",
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
              disabled={this.state.document.status === 2 ? true : false}
            />
          );
        }
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            ราคาต่อหน่วย<LabelRequire>*</LabelRequire>
          </FlexContainer>
        ),
        dataIndex: "unit_price",
        width: "10%",
        render: (text, record, index) => {
          return (
            <Input
              type="number"
              value={record.unit_price}
              onChange={value => this.ChangeUnitPrice(value, index)}
              disabled={this.state.document.status === 2 ? true : false}
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
              disabled={this.state.document.status === 2 ? true : false}
            />
          );
        }
      }
    ];

    this.state = {
      loading: false,
      visible: false,
      columns,
      document: {
        code: "####",
        date: moment(),
        status: 0,
        create_by: this.props.auth.user.name,
        request_code: null,
        request_date: moment(),
        remark: "",
        refDocId: 0
      },
      lines: []
    };
  }

  componentWillMount() {
    const { formId, po } = this.props;
    this.props.ClearRequest();
    this.props.GetRequestReadyToUse();
    if (formId) {
      let { document, lines } = po;
      document.date = moment(document.date);
      document.request_date = moment(document.request_date);
      this.setState({
        document,
        lines
      });
    }
  }

  componentWillReceiveProps({ formId, po }) {
    if (formId && po) {
      let { document, lines } = po;
      document.date = moment(document.date);
      document.request_date = moment(document.request_date);
      this.setState({
        document,
        lines
      });
    } else if (!formId) {
      this.setState({
        document: {
          code: "####",
          date: moment(),
          status: 0,
          create_by: this.props.auth.user.name,
          request_code: null,
          request_date: moment(),
          remark: "",
          refDocId: 0
        },
        lines: []
      });
    }
  }

  async OnDelete() {
    const { formId } = this.props;
    const { document, lines } = this.state;

    const data = {
      document,
      lines
    };
    this.setState({ loading: true });
    const { status } = await this.props.DeletePO(formId, { data });
    if (status) {
      alert("ลบเอกสารสำเร็จ");
      Router.push(`/po/list`);
    } else {
      alert("fail");
    }
    this.setState({ loading: false });
  }

  ChangeQTY(e, index) {
    let lines = [...this.state.lines];
    const newValue = Math.floor(e.target.value);
    if (newValue <= lines[index].request_qty) {
      lines[index].qty = newValue;
    } else {
      lines[index].qty = lines[index].request_qty;
    }
    this.setState({ lines });
  }

  ChangeUnitPrice(e, index) {
    let lines = [...this.state.lines];
    lines[index].unit_price = e.target.value;
    this.setState({ lines });
  }

  ChangeRemark(e, index) {
    let lines = [...this.state.lines];
    lines[index].remark = e.target.value;
    this.setState({ lines });
  }

  ChanegDate(props, e) {
    const newDate = moment(e).format("YYYY-MM-DD");
    const oldDate = moment(props.values.request_date).format("YYYY-MM-DD");

    if (newDate >= oldDate) props.setFieldValue("date", e);
    else
      alert(
        "ต้องเลือกวันที่ของเอกสารใบสั่งซื้อก่อนหรือเท่ากับวันที่ของใบเอกสารขอซื้อ"
      );
  }

  async onSubmit(values) {
    const { formId } = this.props;
    const { lines } = this.state;

    const unitprice_empty = lines.find(line => line.unit_price === 0);

    if (unitprice_empty) {
      alert("ราคาต่อหน่วยไม่สามารถว่างได้");
      return;
    }

    this.setState({ loading: true });

    const saveData = {
      document: values,
      lines
    };

    const { status, id } = formId
      ? await this.props.UpdatePO(formId, saveData)
      : await this.props.InsertPO(saveData);

    if (formId) {
      alert(status ? "บันทึกเอกสารสำเร็จ" : "fail");
    } else {
      alert(status ? "เพิ่มเอกสารสำเร็จ" : "fail");
      if (status) {
        window.location.href = `/po/list`;
      }
    }

    this.setState({ loading: false });
  }

  async AddRequest(request) {
    const result = await this.props.GetRequestById(request.id);

    const { document, lines } = result;

    let document_state = { ...this.state.document };
    document_state.request_code = document.code;

    document_state.request_date = moment(document.date);

    document_state.refDocId = document.id;

    const lines_state = lines.map(line => {
      line.request_qty = line.qty;
      line.request_unit_price = line.unit_price;
      line.uuid = uuidv4();
      return line;
    });
    this.setState({
      document: document_state,
      lines: lines_state
    });
  }

  render() {
    const { formId, RequestReducer } = this.props;
    const { lines, columns, document, loading } = this.state;
    return (
      <MasterContanier>
        <ListHeader
          title="ฟอร์มใบยืนยันคำสั่งซื้อ"
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
                request_code: document.request_code,
                request_date: document.request_date,
                remark: document.remark,
                refDocId: document.refDocId
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
                        component={InputItem}
                        value={props.values.code}
                        disabled={true}
                        padding={true}
                      />
                    </FieldContainer>
                    <FieldContainer width="30%">
                      <Field
                        label="วันที่"
                        name="date"
                        component={InputDateItem}
                        value={moment(props.values.date)}
                        requireStar="true"
                        onChange={e => this.ChanegDate(props, e)}
                        allowClear={false}
                        disabled={
                          this.state.document.status === 2 ? true : false
                        }
                        onBlur={null}
                      />
                    </FieldContainer>

                    <FieldContainer width="30%">
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
                  </FlexContainer>

                  <FlexContainer>
                    <FieldContainer width="40%">
                      <Field
                        label="รหัสใบขอซื้อ"
                        type="text"
                        name="request_code"
                        component={InputItem}
                        value={props.values.request_code}
                        disabled={true}
                        padding={true}
                      />
                    </FieldContainer>
                    <FieldContainer width="30%">
                      <Field
                        label="วันทีใบขอซื้อ"
                        name="request_date"
                        component={InputDateItem}
                        value={moment(props.values.request_date)}
                        allowClear={false}
                        disabled={true}
                        onBlur={null}
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

                  {this.state.document.status === 0 ? (
                    <AddItemButton
                      key="button"
                      onClick={() => this.setState({ visible: true })}
                      icon="plus"
                    >
                      เลือกใบสั่งซื้อ
                    </AddItemButton>
                  ) : null}

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
        <RFQSelectionModal
          visible={this.state.visible}
          closemodal={() => this.setState({ visible: false })}
          onSelect={value => this.AddRequest(value)}
          data={RequestReducer.List}
        />
      </MasterContanier>
    );
  }
}

Form.getInitialProps = async ctx => {
  let formId;
  let po = {
    document: {},
    lines: []
  };
  const { query } = ctx;
  const { auth } = await authInitialProps(true)(ctx);
  if (auth) {
    await checkUserRole(auth)(ctx);

    if (query.id) {
      formId = query.id;
      po = await ctx.reduxStore.dispatch(GetPOById(formId, ctx));
    } else {
      await ctx.reduxStore.dispatch({ type: actionTypes.PO.RESET });
    }
  }

  return { auth, formId, po };
};

export default connect(
  ({ RequestReducer }) => ({
    RequestReducer
  }),
  {
    GetRequestReadyToUse,
    GetRequestById,
    InsertPO,
    UpdatePO,
    DeletePO,
    ClearRequest
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

const TableContainer = styled.div`
  padding-left: 15px;
  padding-top: 10px;
  overflow-y: scroll;
  max-height: 50vh;
`;

const AddItemButton = styled(Button)`
  margin: 5px 0px 0px 15px;
`;
