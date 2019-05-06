import styled from 'styled-components'
import { Icon, Popover } from 'antd'
import Link from 'next/link'

const Managecontent = () => (
  <div>
    <MenuWrapper>
      <IconMenuContent type="book" />
      <Link href={{ pathname: '/category/list' }} prefetch>
        หมวดสินค้า
      </Link>
    </MenuWrapper>

    <MenuWrapper>
      <IconMenuContent type="book" />
      <Link href={{ pathname: '/item/list' }} prefetch>
        สินค้า
      </Link>
    </MenuWrapper>

    <MenuWrapper>
      <IconMenuContent type="book" />
      <Link href={{ pathname: '/unit/list' }} prefetch>
        หน่วยสินค้า
      </Link>
    </MenuWrapper>
    <MenuWrapper>
      <IconMenuContent type="book" />
      <Link href={{ pathname: '/contact/list' }} prefetch>
        บริษัท
      </Link>
    </MenuWrapper>
  </div>
)

const Documentcontent = () => (
  <div>
    <MenuWrapper>
      <IconMenuContent type="form" />
      <Link href={{ pathname: '/request/list' }} prefetch>
        ใบสั่งซื้อ
      </Link>
    </MenuWrapper>
    <MenuWrapper>
      <IconMenuContent type="form" />
      <Link href={{ pathname: '/po/list' }} prefetch>
        ใบยืนยันคำสั่งซื้อ
      </Link>
    </MenuWrapper>

    <MenuWrapper>
      <IconMenuContent type="form" />
      <Link href={{ pathname: '/rs/list' }} prefetch>
        ใบรับสินค้า
      </Link>
    </MenuWrapper>
    <MenuWrapper>
      <IconMenuContent type="form" />
      <Link href={{ pathname: '/dn/list' }} prefetch>
        ใบส่งสินค้า
      </Link>
    </MenuWrapper>
    <MenuWrapper>
      <IconMenuContent type="form" />
      <Link href={{ pathname: '/rn/list' }} prefetch>
        ใบรับสินค้าคืน
      </Link>
    </MenuWrapper>
  </div>
)

const Reportcontent = () => (
  <div>
    <MenuWrapper>
      <IconMenuContent type="solution" />
      <Link href={{ pathname: '/report/expireitem' }} prefetch>
        วันหมดอายุสินค้า
      </Link>
    </MenuWrapper>

    <MenuWrapper>
      <IconMenuContent type="solution" />
      <Link href={{ pathname: '/report/flowdailyitem' }} prefetch>
        ความเคลื่อนไหวสินค้า
      </Link>
    </MenuWrapper>
  </div>
)

export default () => {
  return (
    <div>
      <ImageOverLay src="/static/images/_1.jpg">
        <TextImageContainer>
          <Label>FreezeFood</Label>
        </TextImageContainer>
      </ImageOverLay>

      <MenuContainer>
        <Popover content={Managecontent()} trigger="click">
          <MenuBox>
            <MenuIcon type="file-text" />
            <MenuText>การจัดการ</MenuText>
          </MenuBox>
        </Popover>

        <Popover content={Documentcontent()} trigger="click">
          <MenuBox>
            <MenuIcon type="form" />
            <MenuText>เอกสาร</MenuText>
          </MenuBox>
        </Popover>

        <Popover content={Reportcontent()} trigger="click">
          <MenuBox>
            <MenuIcon type="pie-chart" />
            <MenuText>รายงาน</MenuText>
          </MenuBox>
        </Popover>
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
  width: 200px;
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
  width: 150px;

  display: flex;
  justify-content: center;
  align-items: center;
`

const IconMenuContent = styled(Icon)`
  color: rgb(64, 169, 255);
  margin-right: 5px;
  cursor: pointer;
`
