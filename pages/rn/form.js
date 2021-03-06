import { connect } from 'react-redux'
import { authInitialProps, checkUserRole } from '<utils>/auth'
import { DNFormSchema } from '<utils>/validatior'
import { InputItem, InputTextArea, ActionForm, InputDateItem, SelectItem, DocStatus, DNSelectionModal, ListHeader } from '<components>'
import { GetItemDN, InsertRN, GetRNById, UpdateRN, DeleteRN, GetDNForRN, ClearDN, GetDNReadyToUse } from '<actions>'
import { Formik, Field } from 'formik'
import styled from 'styled-components'
import Router from 'next/router'
import { actionTypes } from '<action_types>'
import moment from 'moment'
import { Table, Input, Modal, Icon, Button } from 'antd'
import { isEmpty } from 'lodash'
import uuidv4 from 'uuid'

const confirm = Modal.confirm

class Form extends React.PureComponent {
  constructor(props) {
    super(props)
    const columns = [
      {
        title: 'รหัสสินค้า',
        dataIndex: 'item_id',
        width: '10%',
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
        width: '10%',
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
        title: 'รหัสใบรับของ',
        dataIndex: 'dn_code',
        width: '20%',
        render: () => {
          return <div>{this.state.document.dn_code}</div>
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
      // {
      //   title: "",
      //   dataIndex: "",
      //   width: "10%",
      //   render: (text, record, index) => {
      //     if (this.props.formId) return;
      //     return (
      //       <a href="#" onClick={() => this.DeleteRow(index)}>
      //         <Icon type="minus" />
      //       </a>
      //     );
      //   }
      // }
    ]

    this.state = {
      loading: false,
      visible: false,
      columns,
      document: {
        code: '####',
        date: moment(),
        dn_date: moment(),
        status: 0,
        create_by: this.props.auth.user.name,
        remark: '',
        refDocId: 0,
      },
      lines: [],
    }
  }

  componentWillMount() {
    const { formId, rn } = this.props
    this.props.ClearDN()
    this.props.GetDNReadyToUse()
    if (formId) {
      let { document, lines } = rn

      this.setState({
        document,
        lines,
      })
    }
  }

  componentWillReceiveProps({ rn, formId }) {
    if (rn && formId) {
      const { document, lines } = rn

      this.setState({
        document,
        lines,
      })
    } else if (!formId) {
      this.setState({
        document: {
          code: '####',
          date: moment(),
          dn_date: moment(),
          status: 0,
          create_by: this.props.auth.user.name,
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
    const { status } = await this.props.DeleteRN(formId, { data })
    if (status) {
      alert('ลบเอกสารสำเร็จ')
      Router.push(`/rn/list`)
    } else {
      alert('fail')
    }
    this.setState({ loading: false })
  }

  ChangeQTY(e, index) {
    let lines = [...this.state.lines]
    const newValue = Math.floor(e.target.value)
    if (newValue <= lines[index].remain_qty) {
      lines[index].qty = newValue
    } else {
      lines[index].qty = lines[index].remain_qty
    }
    this.setState({ lines })
  }

  ChangeRemark(e, index) {
    let lines = [...this.state.lines]
    lines[index].remark = e.target.value
    this.setState({ lines })
  }

  ChanegDate(props, e) {
    const newDate = moment(e).format('YYYY-MM-DD')
    const oldDate = moment(props.values.dn_date).format('YYYY-MM-DD')

    if (newDate >= oldDate) props.setFieldValue('date', e)
    else alert(' ต้องเลือกวันที่ของเอกสารใบรับของคืนก่อนหรือเท่ากับวันที่ของใบเอกสารส่งของ')
  }

  async onSubmit(values) {
    const { formId } = this.props
    let { lines } = this.state

    const lines_empty = lines.length === 0

    // const qty_empty = lines.find(line => line.qty === 0);

    if (lines_empty) {
      alert('รายการสินค้าไม่สามารถว่างได้')
      return
    }
    // if (qty_empty) {
    //   alert("จำนวนสินค้าไม่สามรถว่างได้");
    //   return;
    // }

    this.setState({ loading: true })

    const saveData = {
      document: values,
      lines,
    }

    const { status, id } = formId ? await this.props.UpdateRN(formId, saveData) : await this.props.InsertRN(saveData)

    if (formId) {
      alert(status ? 'บันทึกเอกสารสำเร็จ' : 'fail')
    } else {
      alert(status ? 'เพิ่มเอกสารสำเร็จ' : 'fail')
      if (status) {
        window.location.href = `/rn/list`
      }
    }

    this.setState({ loading: false })
  }

  async AddDN(dn) {
    const result = await this.props.GetDNForRN(dn.code)

    const { document, lines } = result

    let document_state = { ...this.state.document }

    document_state.dn_code = document.code
    document_state.dn_date = document.date
    document_state.contact_id = document.contact_id
    document_state.contact_org = document.contact_org
    document_state.contact_address = document.contact_address
    document_state.refDocId = document.id

    const lines_state = lines.map(line => {
      line.qty = line.remain_qty
      line.uuid = uuidv4()
      return line
    })

    this.setState({
      document: document_state,
      lines: lines_state,
    })
  }

  render() {
    const { formId, DNReducer } = this.props
    const { lines, columns, document, loading } = this.state

    return (
      <MasterContanier>
        <ListHeader title="ฟอร์มใบรับสินค้าคืน" icon="file-text" status={document.status} />

        <Container>
          <FormContainer>
            <Formik
              initialValues={{
                code: document.code,
                dn_code: document.dn_code,
                date: document.date,
                dn_date: document.dn_date,
                create_by: document.create_by,
                remark: document.remark,
                contact: {
                  id: document.contact_id,
                  org: document.contact_org,
                  address: document.contact_address,
                },
                refDocId: document.refDocId,
              }}
              enableReinitialize={true}
              validationSchema={DNFormSchema}
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
                    <FieldContainer width="20%">
                      <Field label="รหัส" type="text" name="code" component={InputItem} value={props.values.code} disabled={true} padding={true} />
                    </FieldContainer>
                    <FieldContainer width="20%">
                      <Field
                        label="วันที่"
                        name="date"
                        component={InputDateItem}
                        value={moment(props.values.date)}
                        requireStar="true"
                        onChange={e => this.ChanegDate(props, e)}
                        allowClear={false}
                        disabled={this.state.document.status === 2 ? true : false}
                        onBlur={null}
                      />
                    </FieldContainer>
                    <FieldContainer width="20%">
                      <Field
                        label="วันที่เอกสารใบส่งของ"
                        name="dn_date"
                        component={InputDateItem}
                        value={moment(props.values.dn_date)}
                        disabled={true}
                      />
                    </FieldContainer>

                    <FieldContainer width="25%">
                      <Field
                        label="บริษัท"
                        name="contact"
                        component={SelectItem}
                        value={props.values.contact.org}
                        requireStar="true"
                        disabled={true}
                      />
                    </FieldContainer>

                    <FieldContainer width="15%">
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

                  <RemarkContainer>
                    <FieldContainer width="50%">
                      <Field
                        label="หมายเหตุ"
                        name="remark"
                        component={InputTextArea}
                        value={props.values.remark}
                        onChange={e => props.setFieldValue('remark', e.target.value)}
                      />
                    </FieldContainer>
                    <div style={{ paddingLeft: '15px' }} />
                    <FieldContainer width="50%">
                      <Field
                        label="ที่อยู่บริษัท"
                        name="contact_address"
                        component={InputTextArea}
                        value={props.values.contact.address}
                        disabled={true}
                      />
                    </FieldContainer>
                  </RemarkContainer>

                  {this.state.document.status === 0 ? (
                    <AddItemButton key="button" onClick={() => this.setState({ visible: true })} icon="plus">
                      เลือกใบส่งสินค้า
                    </AddItemButton>
                  ) : null}

                  <TableContainer>
                    <Table columns={columns} dataSource={lines} pagination={false} rowKey={record => record.uuid} />
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

        <DNSelectionModal
          visible={this.state.visible}
          closemodal={() => this.setState({ visible: false })}
          onSelect={value => this.AddDN(value)}
          data={DNReducer.List}
        />
      </MasterContanier>
    )
  }
}

Form.getInitialProps = async ctx => {
  let formId
  let rn = {
    document: {},
    lines: [],
  }
  const { query } = ctx
  const { auth } = await authInitialProps(true)(ctx)
  if (auth) {
    await checkUserRole(auth)(ctx)

    if (query.id) {
      formId = query.id
      rn = await ctx.reduxStore.dispatch(GetRNById(formId, ctx))
    } else {
      await ctx.reduxStore.dispatch({ type: actionTypes.RN.RESET })
    }
  }

  return { auth, formId, rn }
}

export default connect(
  ({ DNReducer }) => ({
    DNReducer,
  }),
  {
    GetItemDN,
    GetDNForRN,
    InsertRN,
    UpdateRN,
    DeleteRN,
    ClearDN,
    GetDNReadyToUse,
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
  display: flex;
  padding-left: 15px;
`

const LabelRequire = styled.div`
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
