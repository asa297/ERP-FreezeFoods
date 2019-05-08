import { authInitialProps } from '<utils>/auth'
import { connect } from 'react-redux'
import { GetNotification } from '<actions>'
import { HomeComponent } from '<components>'
import { Popover, Button, Icon, Badge, Affix } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import Link from 'next/link'
import Router from 'next/router'

import { LoginForm } from '<components>'

class Index extends React.PureComponent {
  componentWillMount() {
    this.props.GetNotification()
  }

  NoticationCard(line) {
    const { ItemName, UnitName, DocCode, QTY, ExpireDate, _id } = line

    return (
      <NotiCard key={_id}>
        <NotiCover />
        <NotiText>
          <div>
            <b> สินค้า : </b>
            <i>
              {ItemName} ({UnitName})
            </i>
          </div>
          <div>
            <b> รหัสใบรับของ : </b>
            <i>{DocCode}</i> , <b> จำนวน : </b>
            <i>{QTY}</i>
          </div>
          <div>
            <b> วันหมดอายุ : </b>
            <i>{moment(ExpireDate).format('DD-MM-YYYY')}</i>{' '}
          </div>
        </NotiText>
      </NotiCard>
    )
  }

  NoticationContent() {
    const { NotificationReducer } = this.props
    return (
      <NotiContainer>
        {NotificationReducer.map(noti => {
          return this.NoticationCard(noti)
        })}
      </NotiContainer>
    )
  }

  render() {
    const { auth } = this.props
    if (!auth) return <LoginForm />
    return (
      <Container>
        <HomeComponent auth={auth} />
        <Affix style={{ position: 'absolute', bottom: '30px', right: '30px' }}>
          <Popover content={this.NoticationContent()} title="การแจ้งเตือน" trigger="hover" placement="leftBottom">
            <Badge count={this.props.NotificationReducer.length}>
              <Icon type="notification" />
            </Badge>
          </Popover>
        </Affix>
      </Container>
    )
  }
}

Index.getInitialProps = async ctx => {
  const { auth } = await authInitialProps()(ctx)

  return { auth }
}

export default connect(
  ({ NotificationReducer }) => ({ NotificationReducer }),
  { GetNotification },
)(Index)

const NotiCard = styled.div`
  display: flex;
  width: 300px;
  padding: 10px 0px;
  border-bottom: 1px solid #d9d9d9;
`

const NotiCover = styled.div`
  width: 20%;
  background: #d9d9d9;
`

const NotiText = styled.div`
  padding-left: 5px;
  width: 80%;
`

const NotiContainer = styled.div`
  height: 500px;
`

const Container = styled.div`
  width: 100%;
`
