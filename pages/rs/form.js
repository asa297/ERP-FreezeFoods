import { connect } from 'react-redux'
import { authInitialProps, checkUserRole } from '<utils>/auth'
import { RSFormSchema } from '<utils>/validatior'
import { InputItem, InputTextArea, ActionForm, InputDateItem, DocStatus, POSelectionModal, ListHeader } from '<components>'
import { GetPOForRS, InsertRS, UpdateRS, GetRSById, DeleteRS, GetPOReadyToUse, ClearPO } from '<actions>'
import { Formik, Field } from 'formik'
import styled from 'styled-components'
import Router from 'next/router'
import { actionTypes } from '<action_types>'
import moment from 'moment'
import { Table, Input, Button, Modal } from 'antd'
import uuidv4 from 'uuid'

const confirm = Modal.confirm

class Form extends React.PureComponent {
  constructor(props) {
    super(props)
    const columns = [
      {
        title: 'รหัสสินค้า',
        dataIndex: 'item_id',
        width: '15%',
        align: 'center',
      },
      {
        title: 'ชื่อสินค้า',
        dataIndex: 'item_name',
        width: '20%',
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            จำนวน<LabelRequire>*</LabelRequire>
          </FlexContainer>
        ),
        dataIndex: 'qty',
        width: '15%',
        render: (text, record, index) => {
          return (
            <Input type="number" value={record.qty} onChange={value => this.ChangeQTY(value, index)} disabled={this.props.formId ? true : false} />
          )
        },
      },

      {
        title: 'หน่วยสินค้า',
        dataIndex: 'unit_name',
        width: '10%',
      },
      {
        title: (filters, sortOrder) => (
          <FlexContainer>
            <label style={{ whiteSpace: 'nowrap' }}>
              วันหมดอายุ(วัน) <LabelRequire>*</LabelRequire>
            </label>
          </FlexContainer>
        ),
        dataIndex: 'expire_date_count',
        width: '15%',
        render: (text, record, index) => {
          return (
            <Input
              value={record.expire_date_count}
              onChange={value => this.ChangeExpireDate(value, index)}
              disabled={this.props.formId ? true : false}
            />
          )
        },
      },
      {
        title: 'หมายเหตุ',
        dataIndex: 'remark',
        width: '15%',
        render: (text, record, index) => {
          return <Input type="text" value={record.remark} onChange={value => this.ChangeRemark(value, index)} />
        },
      },
    ]

    this.state = {
      loading: false,
      visible: false,
      columns,
      document: {
        code: '####',
        date: moment(),
        status: 0,
        create_by: this.props.auth.user.name,
        po_code: null,
        po_date: moment(),
        remark: '',
        refDocId: 0,
      },
      lines: [],
    }
  }

  componentWillMount() {
    const { formId, rs } = this.props
    this.props.ClearPO()
    this.props.GetPOReadyToUse()
    if (formId) {
      const { document, lines } = rs

      this.setState({
        document,
        lines,
      })
    }
  }

  componentWillReceiveProps({ formId, rs }) {
    if (formId && rs) {
      const { document, lines } = rs

      let document_state = { ...this.state.document }
      document_state.po_code = document.po_code
      document_state.po_date = moment(document.po_date)
      document_state.refDocId = document.ref_doc_id

      const lines_state = lines.map(line => {
        line.po_qty = line.po_qty
        line.uuid = uuidv4()
        return line
      })
      this.setState({
        document: document_state,
        lines: lines_state,
      })
    } else if (!formId) {
      this.setState({
        document: {
          code: '####',
          date: moment(),
          status: 0,
          create_by: this.props.auth.user.name,
          po_code: null,
          po_date: moment(),
          remark: '',
          refDocId: 0,
        },
        lines: [],
      })
    }
  }

  async OnDelete() {
    const { formId } = this.props
    const { document, lines } = this.state

    const data = {
      document,
      lines,
    }
    this.setState({ loading: true })
    const { status } = await this.props.DeleteRS(formId, { data })
    if (status) {
      alert('ลบเอกสารสำเร็จ')
      Router.push(`/rs/list`)
    } else {
      alert('fail')
    }
    this.setState({ loading: false })
  }

  ChangeQTY(e, index) {
    let lines = [...this.state.lines]
    const newValue = Math.floor(e.target.value)
    if (newValue <= lines[index].po_qty) {
      lines[index].qty = newValue
    } else {
      lines[index].qty = lines[index].po_qty
    }
    this.setState({ lines })
  }

  ChangeRemark(e, index) {
    let lines = [...this.state.lines]
    lines[index].remark = e.target.value
    this.setState({ lines })
  }

  ChangeExpireDate(e, index) {
    let lines = [...this.state.lines]
    const newValue = Math.floor(e.target.value)

    lines[index].expire_date_count = newValue

    this.setState({ lines })
  }

  ChanegDate(props, e) {
    const newDate = moment(e).format('YYYY-MM-DD')
    const oldDate = moment(props.values.po_date).format('YYYY-MM-DD')

    if (newDate >= oldDate) props.setFieldValue('date', e)
    else alert(' ต้องเลือกวันที่ของเอกสารใบรับของก่อนหรือเท่ากับวันที่ของใบเอกสารสั่งซื้อ')
  }

  async onSubmit(values) {
    const { formId } = this.props
    const { lines } = this.state

    const lines_empty = lines.length === 0

    const unitprice_empty = lines.find(line => line.unit_price === 0)

    const expiredate_empty = lines.find(line => line.expire_date_count === 0)

    if (lines_empty) {
      alert('รายการสินค้าไม่สามารถว่างได้')
      return
    }
    if (expiredate_empty) {
      alert('วันหมดอายุไม่สามารถว่างได้')
      return
    }
    if (unitprice_empty) {
      alert('ราคาต่อหน่วยไม่สามารถว่างได้')
      return
    }

    this.setState({ loading: true })

    const saveData = {
      document: values,
      lines,
    }

    const { status, id } = formId ? await this.props.UpdateRS(formId, saveData) : await this.props.InsertRS(saveData)

    if (formId) {
      alert(status ? 'บันทึกเอกสารสำเร็จ' : 'fail')
    } else {
      alert(status ? 'เพิ่มเอกสารสำเร็จ' : 'fail')
      if (status) {
        window.location.href = `/rs/list`
      }
    }

    this.setState({ loading: false })
  }

  async AddPO(po) {
    const result = await this.props.GetPOForRS(po.code)

    const { document, lines } = result

    let document_state = { ...this.state.document }
    document_state.po_code = document.code
    document_state.po_date = moment(document.date)
    document_state.refDocId = document.id

    const lines_state = lines.map(line => {
      line.po_qty = line.qty

      line.uuid = uuidv4()
      return line
    })
    this.setState({
      document: document_state,
      lines: lines_state,
    })
  }

  render() {
    const { formId, POReducer, auth } = this.props
    const { lines, columns, document, loading } = this.state

    return (
      <MasterContanier>
        <ListHeader title="ฟอร์มใบรับสินค้า" icon="file-text" status={document.status} />

        <Container>
          <FormContainer>
            <Formik
              initialValues={{
                code: document.code,
                date: document.date,
                create_by: document.create_by,
                po_code: document.po_code,
                po_date: document.po_date,
                remark: document.remark,
                refDocId: document.refDocId,
              }}
              enableReinitialize={true}
              validationSchema={RSFormSchema}
              onSubmit={async (values, actions) => {
                const binding_this = this
                confirm({
                  title: 'ยืนยันการบันทึก',
                  content: '',
                  onOk() {
                    binding_this.onSubmit(values)
                  },
                  onCancel() {
                    return false
                  },
                })
              }}
              render={props => (
                <form>
                  <FlexContainer>
                    <FieldContainer width="40%">
                      <Field label="รหัส" type="text" name="code" component={InputItem} value={props.values.code} disabled={true} padding={true} />
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
                    <FieldContainer width="30%">
                      <Field
                        label="วันทีใบสั่งซื้อ"
                        name="po_date"
                        component={InputDateItem}
                        value={moment(props.values.po_date)}
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
                      onChange={e => props.setFieldValue('remark', e.target.value)}
                    />
                  </RemarkContainer>

                  {this.state.document.status === 0 ? (
                    <AddItemButton key="button" onClick={() => this.setState({ visible: true })} icon="plus">
                      เลือกใบยืนยันคำสั่งซื้อ
                    </AddItemButton>
                  ) : null}

                  <TableContainer>
                    <Table columns={columns} dataSource={lines} pagination={false} rowKey={record => record.uuid} />
                  </TableContainer>

                  {auth.user.role !== 3 && (
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
                  )}
                </form>
              )}
            />
          </FormContainer>
        </Container>

        <POSelectionModal
          visible={this.state.visible}
          closemodal={() => this.setState({ visible: false })}
          onSelect={value => this.AddPO(value)}
          data={POReducer.List}
        />
      </MasterContanier>
    )
  }
}

Form.getInitialProps = async ctx => {
  let formId
  let rs = {
    document: {},
    lines: [],
  }
  const { query } = ctx
  const { auth } = await authInitialProps(true)(ctx)
  if (auth) {
    await checkUserRole(auth)(ctx)

    if (query.id) {
      formId = query.id
      rs = await ctx.reduxStore.dispatch(GetRSById(formId, ctx))
    } else {
      await ctx.reduxStore.dispatch({ type: actionTypes.RS.RESET })
    }
  }

  return { auth, formId, rs }
}

export default connect(
  ({ POReducer }) => ({
    POReducer,
  }),
  {
    GetPOForRS,
    InsertRS,
    UpdateRS,
    DeleteRS,
    GetRSById,
    GetPOReadyToUse,
    ClearPO,
  },
)(Form)

const MasterContanier = styled.div`
  width: 100%;
`
const Container = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
`

const FormContainer = styled.div`
  padding-top: 20px;
  width: 80%;
`

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
`

const FlexContainer = styled.div`
  display: flex;
`

const FieldContainer = styled.div`
  width: ${props => ` ${props.width}` || ''};
`

const RemarkContainer = styled.div`
  padding-left: 15px;
`

const LabelRequire = styled.label`
  color: red;
`

const HeaderForm = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
  align-items: center;
`

const TableContainer = styled.div`
  padding-left: 15px;
  padding-top: 10px;
  overflow-y: scroll;
  max-height: 50vh;
`

const AddItemButton = styled(Button)`
  margin: 5px 0px 0px 15px;
`
