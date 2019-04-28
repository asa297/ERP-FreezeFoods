import { authInitialProps } from '<utils>/auth'
import { connect } from 'react-redux'
import { GetNotification } from '<actions>'
import { Popover, Button, Icon, Badge, Affix } from 'antd'
import styled from 'styled-components'
import moment from 'moment'
import Link from 'next/link'

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
          <Button type="primary">
            <Link href={{ pathname: '/login' }} prefetch>
              เข้าสู่ระบบ
            </Link>
          </Button>
        </NotAuthHome>
      </CenterContainer>
    )
  }

  render() {
    const { auth } = this.props

    if (!auth) return this.ComponentNotAuth()
    return (
      <Container>
        <FlexCenter>
          <MenuBox>
            <MenuIcon type="file-text" />
            <MenuText>
              <Link href={{ pathname: '/category/list' }} prefetch>
                <TextWhite>หมวดหมู่สินค้า</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/item/list' }} prefetch>
                <TextWhite>สินค้า</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/unit/list' }} prefetch>
                <TextWhite>หน่วยสินค้า</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/contact/list' }} prefetch>
                <TextWhite>บริษัท</TextWhite>
              </Link>
            </MenuText>
          </MenuBox>

          <MenuBox>
            <MenuIcon type="form" />
            <MenuText>
              <Link href={{ pathname: '/request/list' }} prefetch>
                <TextWhite>ใบสั่งซื้อ</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/po/list' }} prefetch>
                <TextWhite>ใบยืนยันคำสั่งซื้อ</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/rs/list' }} prefetch>
                <TextWhite>ใบรับสินค้า</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/dn/list' }} prefetch>
                <TextWhite>ใบส่งสินค้า</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/rn/list' }} prefetch>
                <TextWhite>ใบรับสินค้าคืน</TextWhite>
              </Link>
            </MenuText>
          </MenuBox>

          <MenuBox>
            <MenuIcon type="pie-chart" />
            <MenuText>
              <Link href={{ pathname: '/report/expireitem' }} prefetch>
                <TextWhite>วันหมดอายุสินค้า</TextWhite>
              </Link>
            </MenuText>
            <MenuText>
              <Link href={{ pathname: '/report/flowdailyitem' }} prefetch>
                <TextWhite>ความเคลื่อนไหวสินค้า</TextWhite>
              </Link>
            </MenuText>
          </MenuBox>
        </FlexCenter>

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

const MenuBox = styled.div`
  height: 50vh;
  width: 25vh;
  background: #21206c;
  display: flex;
  flex-direction: column;

  margin: 20px;
  border-radius: 20px;
`

const MenuIcon = styled(Icon)`
  font-size: 60px;
  color: white;
  padding: 25px;
`

const MenuText = styled.div`
  padding: 10px 30px;
`

const TextWhite = styled.a`
  color: white;
`

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow-y: scroll;
  height: 100vh;
`

const Container = styled.div`
  width: 100%;
`

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`

const ImageContainer = styled.div``

const NotAuthHome = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`
