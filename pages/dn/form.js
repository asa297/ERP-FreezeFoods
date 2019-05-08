import { connect } from 'react-redux'
import { authInitialProps, checkUserRole } from '<utils>/auth'
import { DNFormSchema } from '<utils>/validatior'
import { InputItem, InputTextArea, ActionForm, InputDateItem, SelectItem, ItemDNSelectionModal, ListHeader } from '<components>'
import { GetItemDN, GetAllContact, ClearContact, InsertDN, GetDNById, UpdateDN, DeleteDN } from '<actions>'
import { Formik, Field } from 'formik'
import styled from 'styled-components'
import Router from 'next/router'
import { actionTypes } from '<action_types>'
import moment from 'moment'
import { Table, Input, Modal, Icon, Button } from 'antd'
import uuidv4 from 'uuid'
import { sumBy } from 'lodash'

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
        title: 'รหัสใบรับของ',
        dataIndex: 'rs_code',
        width: '15%',
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
        title: (filters, sortOrder) => (
          <FlexContainer>
            <label style={{ whiteSpace: 'nowrap' }}>
              ราคาต่อหน่วย <LabelRequire>*</LabelRequire>
            </label>
          </FlexContainer>
        ),
        dataIndex: 'expire_date_count',
        width: '15%',
        render: (text, record, index) => {
          return (
            <Input
              type="number"
              value={record.unit_price}
              onChange={value => this.ChangeUnitPrice(value, index)}
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
      {
        title: '',
        dataIndex: '',
        width: '5%',
        render: (text, record, index) => {
          if (this.props.formId) return
          return (
            <a href="#" onClick={() => this.DeleteRow(index)}>
              <Icon type="minus" />
            </a>
          )
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
        remark: '',
      },
      lines: [],
    }
  }

  componentWillMount() {
    const { date } = this.state.document
    this.props.GetAllContact()
    this.props.GetItemDN(date)
    const { formId, dn } = this.props
    if (formId) {
      const { document, lines } = dn
      this.setState({
        document,
        lines,
      })
    }
  }

  componentWillReceiveProps({ dn, formId }) {
    if (dn && formId) {
      const { document, lines } = dn
      this.setState({
        document,
        lines,
      })
    } else if (!formId && !this.state.Set_Item_Select) {
      this.setState({
        document: {
          code: '####',
          date: moment(),
          status: 0,
          create_by: this.props.auth.user.name,
          remark: '',
        },
        lines: [],
      })
    }
  }

  componentWillUnmount() {
    this.props.ClearContact()
    //Need to Clear ItemCategory Reducer
  }

  async OnDelete() {
    const { formId } = this.props
    const { document, lines } = this.state

    const data = {
      document,
      lines,
    }
    this.setState({ loading: true })
    const { status } = await this.props.DeleteDN(formId, { data })
    if (status) {
      alert('ลบเอกสารสำเร็จ')
      Router.push(`/dn/list`)
    } else {
      alert('fail')
    }
    this.setState({ loading: false })
  }

  DeleteRow(index) {
    let lines = [...this.state.lines]
    lines.splice(index, 1)

    this.setState({ lines })
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

  ChangeUnitPrice(e, index) {
    let lines = [...this.state.lines]
    lines[index].unit_price = e.target.value
    this.setState({ lines })
  }

  ChangeRemark(e, index) {
    let lines = [...this.state.lines]
    lines[index].remark = e.target.value
    this.setState({ lines })
  }

  onChangeContact(id, props) {
    const contact = this.props.ContactReducer.List.find(contact => contact.id === id)
    props.setFieldValue('contact', contact)
  }

  ChanegDate(props, e) {
    const binding_this = this
    confirm({
      title: 'ยืนยันการเปลี่ยนวันที่',
      content: 'ถ้ายืนยันระบบจะลบรายการทั้งหมดของเอกสารนี้',
      async onOk() {
        props.setFieldValue('date', e)
        await binding_this.setState({ lines: [], Set_Item_Select: true })
        const newDate = moment(e).format('YYYY-MM-DD')
        binding_this.props.GetItemDN(newDate)
      },
      onCancel() {
        return false
      },
    })
  }

  async onSubmit(values) {
    const { formId } = this.props
    let { lines } = this.state

    const lines_empty = lines.length === 0

    const qty_empty = lines.find(line => line.qty === 0)

    const unitprice_empty = lines.find(line => line.unit_price === 0)

    if (lines_empty) {
      alert('รายการสินค้าไม่สามารถว่างได้')
      return
    }
    if (qty_empty) {
      alert('จำนวนสินค้าไม่สามารถว่างได้')
      return
    }
    if (unitprice_empty) {
      alert('ราคาต่อหน่วยไม่ได้สามารถว่างได้')
      return
    }

    this.setState({ loading: true })

    const saveData = {
      document: values,
      lines,
    }

    const { status, id } = formId ? await this.props.UpdateDN(formId, saveData) : await this.props.InsertDN(saveData)

    if (formId) {
      alert(status ? 'บันทึกเอกสารสำเร็จ' : 'fail')
    } else {
      alert(status ? 'เพิ่มเอกสารสำเร็จ' : 'fail')
      if (status) {
        window.location.href = `/dn/list`
      }
    }

    this.setState({ loading: false })
  }

  AddItem(rows) {
    const lines = rows.map(line => {
      line.qty = line.remain_qty = line.remain_qty
      line.unit_price = 0
      line.uuid = uuidv4()

      return line
    })

    this.setState({ lines: [...this.state.lines, ...lines] })
  }

  render() {
    const { formId, ContactReducer, RSReducer } = this.props
    const { lines, columns, document, loading } = this.state

    return (
      <MasterContanier>
        <ListHeader title="ฟอร์มใบส่งสินค้า" icon="file-text" status={document.status} />

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
                      org: document.contact_org,
                      address: document.contact_address,
                    }
                  : '',
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
                    <FieldContainer width="25%">
                      <Field label="รหัส" type="text" name="code" component={InputItem} value={props.values.code} disabled={true} padding={true} />
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
                        value={props.values.contact ? props.values.contact.org : ''}
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
                        onChange={e => props.setFieldValue('remark', e.target.value)}
                      />
                    </FieldContainer>
                    <div style={{ paddingLeft: '15px' }} />
                    <FieldContainer width="50%">
                      <Field
                        label="ที่อยู่บริษัท"
                        name="contact_address"
                        component={InputTextArea}
                        value={props.values.contact ? props.values.contact.address : ''}
                        onChange={e => props.setFieldValue('contact_address', e.target.value)}
                        disabled={true}
                      />
                    </FieldContainer>
                  </RemarkContainer>

                  {this.state.document.status === 0 ? (
                    <AddItemButton key="button" onClick={() => this.setState({ visible: true })} icon="plus">
                      เพิ่มสินค้า
                    </AddItemButton>
                  ) : null}

                  <TableContainer>
                    <Table columns={columns} dataSource={lines} pagination={false} rowKey={record => record.uuid} />
                  </TableContainer>

                  <GrandTotalContainer>
                    <h2 style={{ margin: '0px' }}>Grand Total :</h2>
                    <label style={{ paddingLeft: '5px', fontSize: '20px' }}>
                      {sumBy(this.state.lines, line => {
                        return line.qty * line.unit_price
                      }).toLocaleString()}
                    </label>
                  </GrandTotalContainer>

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

        <ItemDNSelectionModal
          visible={this.state.visible}
          closemodal={() => this.setState({ visible: false })}
          onSubmit={value => this.AddItem(value)}
          data={RSReducer.List}
          lines={this.state.lines}
        />
      </MasterContanier>
    )
  }
}

Form.getInitialProps = async ctx => {
  let formId
  let dn = {
    document: {},
    lines: [],
  }
  const { query } = ctx
  const { auth } = await authInitialProps(true)(ctx)
  if (auth) {
    await checkUserRole(auth)(ctx)

    if (query.id) {
      formId = query.id
      dn = await ctx.reduxStore.dispatch(GetDNById(formId, ctx))
    } else {
      await ctx.reduxStore.dispatch({ type: actionTypes.DN.RESET })
    }
  }

  return { auth, formId, dn }
}

export default connect(
  ({ RSReducer, ContactReducer }) => ({
    RSReducer,
    ContactReducer,
  }),
  {
    GetItemDN,
    GetAllContact,
    ClearContact,
    InsertDN,
    UpdateDN,
    DeleteDN,
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

const LabelRequire = styled.label`
  color: red;
`

const TableContainer = styled.div`
  padding-left: 15px;
  padding-top: 10px;
  overflow-y: scroll;
  max-height: 50vh;
`

const GrandTotalContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`

const AddItemButton = styled(Button)`
  margin: 5px 0px 0px 15px;
`
