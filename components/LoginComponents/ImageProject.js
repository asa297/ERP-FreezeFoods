import styled from 'styled-components'

const ImageProject = () => {
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

export default ImageProject

const ImageLogin = styled.div`
  width: 100%;
  height: 100%;
  background: url(${props => props.src});
  background-size: 100% 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

const ImageContainer = styled.div`
  width: 65%;
  @media (min-width: 576px) and (max-width: 768px) {
    height: 25%;
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    height: 30%;
  }

  @media (min-width: 1200px) and (max-width: 1600px) {
    height: 50%;
  }

  height: 40%;
`

const TextImageContainer = styled.div`
  background: rgba(165, 165, 165, 0.5);
  width: 60%;
  height: 40%;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Label = styled.label`
  font-size: 30px;
  font-weight: bold;
  color: white;
`
