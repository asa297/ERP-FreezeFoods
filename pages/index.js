import { authInitialProps } from '<utils>/auth'
import { connect } from 'react-redux'
import { GetNotification } from '<actions>'
import { HomeComponent } from '<components>'
import { Popover, Button, Icon, Badge, Affix } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import Link from 'next/link'
import Router from 'next/router'

import { ImageProject } from '<components>'

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

  ComponentNotAuth() {
    return (
      <CenterContainer>
        <ImageProject />
        <NotAuthHome>
          <ButtonWrapper onClick={() => Router.push('/login')}>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
              {/* <Link href={{ pathname: '/login' }} prefetch> */}
              กรุณาเข้าสู่ระบบ
              {/* </Link> */}
            </div>
          </ButtonWrapper>
        </NotAuthHome>
      </CenterContainer>
    )
  }

  render() {
    const { auth } = this.props
    if (!auth) return this.ComponentNotAuth()
    return (
      <Container>
        <HomeComponent />
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

const CenterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`

const ButtonWrapper = styled(Button)`
  background-color: black;
  color: white;
  padding: 20px 100px;
  @media (max-width: 576px) {
    padding: 20px 50px;
  }
  border-radius: 5px;
  :hover,
  :active,
  :visited {
    background-color: black;
    color: white;
  }
`

const NotAuthHome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`
