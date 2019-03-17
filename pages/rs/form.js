import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { POFormSchema } from "<utils>/validatior";
import {
  InputItem,
  InputTextArea,
  ActionForm,
  InputDateItem,
  SelectOption,
  DocStatus
} from "<components>";
import { GetPOForRS, InsertRS, UpdateRS, GetPOById, DeleteRS } from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import moment from "moment";
import { Table, Input, Icon, Modal, DatePicker } from "antd";
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
        width: "10%"
      },
      {
        title: "หน่วยสินค้า",
        dataIndex: "unit_name",
        width: "10%"
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            วันหมดอายุ<LabelRequire>*</LabelRequire>
          </FlexContainer>
        ),
        dataIndex: "expire_date",
        width: "10%",
        render: (text, record, index) => {
          return (
            <Input
              value={record.qty}
              // onChange={value => this.ChangeQTY(value, index)}
              // disabled={this.state.document.status === 2 ? true : false}
            />
          );
        }
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
              disabled={this.state.document.status === 2 ? true : false}
            />
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
        po_code: null,
        po_date: moment(),
        remark: "",
        refDocId: 0
      },
      lines: [],
      show_modal: true,
      found: true
    };
  }

  componentWillMount() {
    const { formId, po } = this.props;
    if (formId) {
      const { document, lines } = po;
      this.setState({
        document,
        lines,
        show_modal: false
      });
    }
  }

  componentWillReceiveProps({ POReducer, formId, rs }) {
    // console.log(POReducer);
    const { Item } = POReducer;
    if ((!formId && !isEmpty(Item)) || (formId && rs)) {
      const { document, lines } = !formId ? Item : po;

      let document_state = { ...this.state.document };
      document_state.po_code = !formId ? document.code : document.po_code;
      document_state.po_date = !formId
        ? moment(document.date)
        : moment(document.po_date);
      document_state.refDocId = !formId ? document.id : document.ref_doc_id;

      const lines_state = lines.map(line => {
        line.po_qty = !formId ? line.qty : line.po_qty;
        line.uuid = uuidv4();
        return line;
      });
      this.setState({
        document: document_state,
        lines: lines_state,
        show_modal: false,
        found: true
      });
    } else if (!formId) {
      this.setState({
        document: {
          code: "####",
          date: moment(),
          status: 0,
          create_by: this.props.auth.user.name,
          po_code: null,
          po_date: moment(),
          remark: "",
          refDocId: 0
        },
        lines: [],
        show_modal: true,
        found: true
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

    const { status } = await this.props.DeleteRS(formId, { data });
    if (status) {
      alert("Delete Done");
      Router.push(`/rs/list`);
    } else {
      alert("fail");
    }
  }

  ChangeQTY(e, index) {
    let lines = [...this.state.lines];
    const newValue = Math.floor(e.target.value);
    if (newValue <= lines[index].po_qty) {
      lines[index].qty = newValue;
    } else {
      lines[index].qty = lines[index].po_qty;
    }
    this.setState({ lines });
  }

  ChangeRemark(e, index) {
    let lines = [...this.state.lines];
    lines[index].remark = e.target.value;
    this.setState({ lines });
  }

  ChanegDate(props, e) {
    if (e >= props.values.po_date) props.setFieldValue("date", e);
    else alert("cannot set po date less than rfq date");
  }

  async onSubmit(values) {
    const { formId } = this.props;
    const { lines } = this.state;

    const lines_empty = lines.length === 0;

    const unitprice_empty = lines.find(line => line.unit_price === 0);

    if (lines_empty) {
      alert("lines cannot empty");
      return;
    }
    if (unitprice_empty) {
      alert("unit price cannot empty");
      return;
    }

    this.setState({ loading: true });

    const saveData = {
      document: values,
      lines
    };

    console.log(saveData);
    const { status, id } = formId
      ? await this.props.UpdateRS(formId, saveData)
      : await this.props.InsertRS(saveData);

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

  async GetPO(code) {
    const { status: found } = await this.props.GetPOForRS(code);
    if (found) {
      this.setState({ show_modal: false });
    }

    this.setState({ found });
  }

  render() {
    const { formId } = this.props;
    const { lines, columns, document, loading, found } = this.state;

    return (
      <MasterContanier>
        <Container>
          <HeaderForm>
            <H1Text>ฟอร์มใบรับของ</H1Text>
            <DocStatus status={document.status} />
          </HeaderForm>
          <FormContainer>
            <Formik
              initialValues={{
                code: document.code,
                date: document.date,
                create_by: document.create_by,
                po_code: document.po_code,
                po_date: document.po_date,
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
                        disabled={formId ? true : false}
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
                        label="รหัสใบสั่งซื้อ"
                        type="text"
                        name="po_code"
                        component={InputItem}
                        value={props.values.po_code}
                        disabled={true}
                        padding={true}
                      />
                    </FieldContainer>
                    <FieldContainer width="40%">
                      <Field
                        label="วันทีใบสั่งซื้อ"
                        name="po_date"
                        component={InputDateItem}
                        value={props.values.po_date}
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
                      onSubmit={props.handleSubmit}
                    />
                  </FlexCenter>
                </form>
              )}
            />
          </FormContainer>
        </Container>

        <Modal
          title="ค้นหาเอกสารใบสั่งซื้อ"
          onCancel={() => this.setState({ show_modal: false })}
          visible={this.state.show_modal}
          footer={null}
        >
          <InputSearch
            placeholder="รหัสเอกสารใบสั่งซื้อ"
            prefix={<Icon type="search" />}
            onPressEnter={e => this.GetPO(e.target.value)}
            found={found.toString()}
          />
          {!found ? <label className="error">PO Not found</label> : null}
        </Modal>
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
  ({ POReducer }) => ({
    POReducer
  }),
  {
    GetPOForRS,
    InsertRS,
    UpdateRS,
    DeleteRS
  }
)(Form);

const InputSearch = styled(Input)`
  .ant-input {
    border: ${props =>
      props.found === "false" ? "1px solid red" : "1px solid #d9d9d9"};
  }
`;

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
