import { connect } from "react-redux";
import { authInitialProps, checkUserRole } from "<utils>/auth";
import { POFormSchema } from "<utils>/validatior";
import {
  InputItemInline,
  InputItem,
  InputTextArea,
  ActionForm,
  InputDateItem,
  SelectOption,
  DocStatus
} from "<components>";
import { GetRequestForPO, InsertPO, UpdatePO, GetPOById } from "<actions>";
import { Formik, Field } from "formik";
import styled from "styled-components";
import Router from "next/router";
import { actionTypes } from "<action_types>";
import moment from "moment";
import { Table, Input, Icon, Modal } from "antd";
import uuidv4 from "uuid";
import { isEmpty } from "lodash";

const Search = Input.Search;

const confirm = Modal.confirm;

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    const columns = [
      {
        title: "รหัสสินค้า",
        dataIndex: "item_id",
        width: "15%",
        align: "center",
        render: (text, record, index) => {
          return (
            <SelectOption data={[]} value={record.item_id} disabled={true} />
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
        dataIndex: "po_qty",
        width: "10%",
        render: (text, record, index) => {
          return (
            <Input
              type="number"
              value={record.po_qty}
              onChange={value => this.ChangeQTY(value, index)}
              disabled={this.state.status === 2 ? true : false}
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
        dataIndex: "po_unit_price",
        width: "10%",
        render: (text, record, index) => {
          return (
            <Input
              type="number"
              value={record.po_unit_price}
              onChange={value => this.ChangeUnitPrice(value, index)}
              disabled={this.state.status === 2 ? true : false}
            />
          );
        }
      },
      {
        title: "หน่วยสินค้า",
        dataIndex: "unit_name",
        width: "15%",
        render: (text, record, index) => {
          return (
            <SelectOption data={[]} value={record.unit_name} disabled={true} />
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
        code_po: null,
        date_po: moment(),
        remark: "",
        refDocId: 0
      },
      lines: [],
      deleted_data: [],
      show_modal: true,
      found: true
    };
  }

  componentWillMount() {
    const { formId } = this.props;
    if (formId) {
      const { document, lines } = this.props.request;
      this.setState({
        document,
        data: lines,
        show_modal: false
      });
    }
  }

  componentWillReceiveProps({ RequestReducer, formId }) {
    const { Item } = RequestReducer;
    if (!formId && !isEmpty(Item)) {
      // console.log(RequestReducer);
      const { document, lines } = Item;
      let document_state = { ...this.state.document };
      document_state.code_po = document.code;
      document_state.date_po = document.date;
      document_state.refDocId = document.id;

      const lines_state = lines.map(line => {
        line.po_qty = line.qty;
        line.po_unit_price = line.unit_price;
        line.uuid = uuidv4();
        return line;
      });
      this.setState({ document: document_state, lines: lines_state });
    }
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

  ChangeQTY(e, index) {
    let lines = [...this.state.lines];
    const newValue = Math.floor(e.target.value);
    if (newValue <= lines[index].qty) {
      lines[index].po_qty = newValue;
    } else {
      lines[index].po_qty = lines[index].qty;
    }
    this.setState({ lines });
  }

  ChangeUnitPrice(e, index) {
    let lines = [...this.state.lines];
    lines[index].po_unit_price = e.target.value;
    this.setState({ lines });
  }

  ChangeRemark(e, index) {
    let lines = [...this.state.lines];
    lines[index].remark = e.target.value;
    this.setState({ lines });
  }

  ChanegDate(props, e) {
    if (e >= props.values.date_po) props.setFieldValue("date", e);
    else alert("cannot set po date less than rfq date");
  }

  async onSubmit(values) {
    const { formId } = this.props;
    const { lines, deleted_data } = this.state;

    const lines_empty = lines.length === 0;
    const qty_empty = lines.find(line => line.po_qty === 0);
    const unitprice_empty = lines.find(line => line.po_unit_price === 0);

    if (lines_empty) {
      alert("lines cannot empty");
      return;
    }
    if (qty_empty) {
      alert("qty cannot empty");
      return;
    }
    if (unitprice_empty) {
      alert("unit price cannot empty");
      return;
    }

    this.setState({ loading: true });

    const saveData = {
      document: values,
      lines,
      deleted_data
    };

    const { status, id } = formId
      ? await this.props.UpdatePO(formId, saveData)
      : await this.props.InsertPO(saveData);

    // console.log(id);
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

  async GetRFQ(code) {
    const { status: found } = await this.props.GetRequestForPO(code);
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
            <H1Text>ฟอร์มใบสั่งซื้อ</H1Text>
            <DocStatus status={document.status} />
          </HeaderForm>
          <FormContainer>
            <Formik
              initialValues={{
                code: document.code,
                date: document.date,
                create_by: document.create_by,
                code_po: document.code_po,
                date_po: document.date_po,
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
                        label="รหัสใบขอซื้อ"
                        type="text"
                        name="code_po"
                        component={InputItem}
                        value={props.values.code_po}
                        disabled={true}
                        padding={true}
                      />
                    </FieldContainer>
                    <FieldContainer width="40%">
                      <Field
                        label="วันทีใบขอซื้อ"
                        name="date_po"
                        component={InputDateItem}
                        value={moment(props.values.date_po)}
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
          title="ค้นหาเอกสารใบขอซื้อ"
          onCancel={() => this.setState({ show_modal: false })}
          visible={this.state.show_modal}
          footer={null}
        >
          <InputSearch
            placeholder="รหัสเอกสารใบขอซื้อ"
            prefix={<Icon type="search" />}
            onPressEnter={e => this.GetRFQ(e.target.value)}
            found={found.toString()}
          />
          {!found ? <label className="error">RFQ Not found</label> : null}
        </Modal>
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
    GetRequestForPO,
    InsertPO,
    UpdatePO
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
  paddingleft: 15px;
  paddingtop: 10px;
  overflowy: scroll;
  maxheight: 50vh;
`;
