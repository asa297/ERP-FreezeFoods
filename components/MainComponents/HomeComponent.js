import styled from 'styled-components'
import { Icon, Popover } from 'antd'
import Link from 'next/link'
import { RoleMappingRoute } from '../../static/data.json'

const Managecontent = auth => {
  const CategoryPage = RoleMappingRoute.find(
    route => route.page === 'Category' && route.role.find(role => role === auth.user.role) && route.type === 'List',
  )
  const ItemPage = RoleMappingRoute.find(route => route.page === 'Item' && route.role.find(role => role === auth.user.role) && route.type === 'List')
  const UnitPage = RoleMappingRoute.find(route => route.page === 'Unit' && route.role.find(role => role === auth.user.role) && route.type === 'List')
  const ContactPage = RoleMappingRoute.find(
    route => route.page === 'Contact' && route.role.find(role => role === auth.user.role) && route.type === 'List',
  )

  return (
    <MenuContentContainer>
      {CategoryPage && (
        <MenuWrapper>
          <IconMenuContent type="book" />
          <Link href={{ pathname: '/category/list' }} prefetch>
            <MenuContentText>หมวดสินค้า</MenuContentText>
          </Link>
        </MenuWrapper>
      )}

      {ItemPage && (
        <MenuWrapper>
          <IconMenuContent type="book" />
          <Link href={{ pathname: '/item/list' }} prefetch>
            <MenuContentText>สินค้า</MenuContentText>
          </Link>
        </MenuWrapper>
      )}

      {UnitPage && (
        <MenuWrapper>
          <IconMenuContent type="book" />
          <Link href={{ pathname: '/unit/list' }} prefetch>
            <MenuContentText>หน่วยสินค้า</MenuContentText>
          </Link>
        </MenuWrapper>
      )}

      {ContactPage && (
        <MenuWrapper>
          <IconMenuContent type="book" />
          <Link href={{ pathname: '/contact/list' }} prefetch>
            <MenuContentText>บริษัท</MenuContentText>
          </Link>
        </MenuWrapper>
      )}
    </MenuContentContainer>
  )
}

const Documentcontent = auth => {
  const RequestPage = RoleMappingRoute.find(
    route => route.page === 'Request' && route.role.find(role => role === auth.user.role) && route.type === 'List',
  )
  const PurchasePage = RoleMappingRoute.find(
    route => route.page === 'Purchase' && route.role.find(role => role === auth.user.role) && route.type === 'List',
  )
  const ReceiveSuppierPage = RoleMappingRoute.find(
    route => route.page === 'ReceiveSuppier' && route.role.find(role => role === auth.user.role) && route.type === 'List',
  )
  const DeliveryNotePage = RoleMappingRoute.find(
    route => route.page === 'DeliveryNote' && route.role.find(role => role === auth.user.role) && route.type === 'List',
  )
  const ReceiveNotePage = RoleMappingRoute.find(
    route => route.page === 'ReceiveNote' && route.role.find(role => role === auth.user.role) && route.type === 'List',
  )

  return (
    <MenuContentContainer>
      {RequestPage && (
        <MenuWrapper>
          <IconMenuContent type="form" />
          <Link href={{ pathname: '/request/list' }} prefetch>
            <MenuContentText>ใบสั่งซื้อ</MenuContentText>
          </Link>
        </MenuWrapper>
      )}
      {PurchasePage && (
        <MenuWrapper>
          <IconMenuContent type="form" />
          <Link href={{ pathname: '/po/list' }} prefetch>
            <MenuContentText>ใบยืนยันคำสั่งซื้อ</MenuContentText>
          </Link>
        </MenuWrapper>
      )}
      {ReceiveSuppierPage && (
        <MenuWrapper>
          <IconMenuContent type="form" />
          <Link href={{ pathname: '/rs/list' }} prefetch>
            <MenuContentText>ใบรับสินค้า</MenuContentText>
          </Link>
        </MenuWrapper>
      )}

      {DeliveryNotePage && (
        <MenuWrapper>
          <IconMenuContent type="form" />
          <Link href={{ pathname: '/dn/list' }} prefetch>
            <MenuContentText>ใบส่งสินค้า</MenuContentText>
          </Link>
        </MenuWrapper>
      )}

      {ReceiveNotePage && (
        <MenuWrapper>
          <IconMenuContent type="form" />
          <Link href={{ pathname: '/rn/list' }} prefetch>
            <MenuContentText>ใบรับสินค้าคืน</MenuContentText>
          </Link>
        </MenuWrapper>
      )}
    </MenuContentContainer>
  )
}

const Reportcontent = auth => {
  const ExpireItemReport = RoleMappingRoute.find(route => route.page === 'ExpireItemReport' && route.role.find(role => role === auth.user.role))

  const FlowDailyItemReport = RoleMappingRoute.find(route => route.page === 'FlowDailyItemReport' && route.role.find(role => role === auth.user.role))
  return (
    <MenuContentContainer>
      {ExpireItemReport && (
        <MenuWrapper>
          <IconMenuContent type="solution" />
          <Link href={{ pathname: '/report/expireitem' }} prefetch>
            <MenuContentText>วันหมดอายุสินค้า</MenuContentText>
          </Link>
        </MenuWrapper>
      )}

      {FlowDailyItemReport && (
        <MenuWrapper>
          <IconMenuContent type="solution" />
          <Link href={{ pathname: '/report/flowdailyitem' }} prefetch>
            <MenuContentText>ความเคลื่อนไหวสินค้า</MenuContentText>
          </Link>
        </MenuWrapper>
      )}
    </MenuContentContainer>
  )
}

export default ({ auth }) => {
  const ManageModule = RoleMappingRoute.filter(route => route.sub === 'manage' && route.role.find(role => role === auth.user.role))
  const DocumentModule = RoleMappingRoute.filter(route => route.sub === 'document' && route.role.find(role => role === auth.user.role))
  const ReportModule = RoleMappingRoute.filter(route => route.sub === 'Report' && route.role.find(role => role === auth.user.role))

  return (
    <div>
      <ImageOverLay src="/static/images/_1.jpg">
        <TextImageContainer>
          <Label>FreezeFood</Label>
        </TextImageContainer>
      </ImageOverLay>

      <MenuContainer>
        {ManageModule.length !== 0 && (
          <Popover content={Managecontent(auth)} trigger="click">
            <MenuBox>
              <MenuIcon type="file-text" />
              <MenuText>การจัดการ</MenuText>
            </MenuBox>
          </Popover>
        )}

        {DocumentModule.length !== 0 && (
          <Popover content={Documentcontent(auth)} trigger="click">
            <MenuBox>
              <MenuIcon type="form" />
              <MenuText>เอกสาร</MenuText>
            </MenuBox>
          </Popover>
        )}

        {ReportModule.length !== 0 && (
          <Popover content={Reportcontent(auth)} trigger="click">
            <MenuBox>
              <MenuIcon type="pie-chart" />
              <MenuText>รายงาน</MenuText>
            </MenuBox>
          </Popover>
        )}
      </MenuContainer>

      <FooterContainer />
    </div>
  )
}

const ImageOverLay = styled.div`
  width: 100%;
  height: 80vh;

  background: url(${props => props.src});
  background-size: 100%;
`

const FooterContainer = styled.div`
  height: 20vh;
  background-color: rgba(165, 165, 165, 0.2);
`

const TextImageContainer = styled.div`
  background: rgba(165, 165, 165, 0.5);
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Label = styled.label`
  font-size: 70px;
  font-weight: bold;
  color: white;
`

const MenuContainer = styled.div`
  position: absolute;
  bottom: 17vh;
  display: flex;
  width: calc(100% - 200px);
  justify-content: center;
`

const MenuBox = styled.div`
  width: 250px;
  background: rgba(113, 113, 113, 0.8);
  margin: 0 10px;

  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;

  :hover {
    background: rgba(113, 113, 113, 0.6);
  }
`

const MenuIcon = styled(Icon)`
  font-size: 70px;
  color: white;
  padding: 25px 35px 10px 35px;
`

const MenuText = styled.div`
  font-size: 36px;
  text-align: center;
  color: white;
  padding: 10px 15px;
`

const MenuWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

const IconMenuContent = styled(Icon)`
  color: rgb(64, 169, 255);
  margin-right: 5px;
  cursor: pointer;
`

const MenuContentText = styled.div`
  font-size: 18px;
  color: rgb(64, 169, 255);
  cursor: pointer;
`

const MenuContentContainer = styled.div`
  width: 300px;
`
