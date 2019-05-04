import styled from 'styled-components'

const ImageOverlay = () => {
  return (
    <ImageContainer>
      <ImageLogin src="/static/images/_1.jpg">
        <TextImageContainer>
          <Label>FreezeFood</Label>
        </TextImageContainer>
      </ImageLogin>
    </ImageContainer>
  )
}

export default ImageOverlay

const ImageLogin = styled.div`
  width: 100%;
  height: 100%;
  background: url(${props => props.src});
  background-size: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

const ImageContainer = styled.div`
  width: 100%;

  @media (max-width: 850px) {
    height: 150px;
  }

  height: 200px;
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
  font-size: 30px;
  font-weight: bold;
  color: white;
`
