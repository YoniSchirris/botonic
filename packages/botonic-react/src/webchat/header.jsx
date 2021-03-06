import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { staticAsset, ConditionalWrapper } from '../utils'
import styled from 'styled-components'
import { WEBCHAT, COLORS } from '../constants'
import { Flex } from 'rebass'
import { motion } from 'framer-motion'

const Header = styled(Flex)`
  background: linear-gradient(
    90deg,
    ${COLORS.BLEACHED_CEDAR_PURPLE} 0%,
    ${props => props.color} 100%
  );
  height: 55px;
  border-radius: 6px 6px 0px 0px;
`

const ImageContainer = styled(Flex)`
  padding: 10px;
  align-items: center;
`

const Image = styled.img`
  width: 32px;
  border-radius: 50%;
`

const TextContainer = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
`

const Title = styled(Flex)`
  font-family: inherit;
  font-size: 15px;
  font-weight: bold;
  color: ${COLORS.SOLID_WHITE};
`

const Subtitle = styled(Flex)`
  font-family: inherit;
  font-size: 11px;
  color: ${COLORS.SOLID_WHITE};
`

const CloseHeader = styled.div`
  padding: 0px 16px;
  cursor: pointer;
  color: ${COLORS.SOLID_WHITE};
  font-family: inherit;
  font-size: 36px;
`

export const DefaultHeader = props => {
  const { getThemeProperty } = props
  const animationsEnabled = getThemeProperty('animations.enable', true)
  let headerImage = getThemeProperty(
    'header.image',
    getThemeProperty('brand.image', WEBCHAT.DEFAULTS.LOGO)
  )

  let headerTitle = getThemeProperty('header.title', 'Botonic')
  let headerSubtitle = getThemeProperty('header.subtitle', '')

  return (
    <Header color={props.color} style={{ ...getThemeProperty('header.style') }}>
      {headerImage && (
        <ImageContainer>
          <Image src={staticAsset(headerImage)} />
        </ImageContainer>
      )}
      <TextContainer ml={headerImage ? '0px' : '16px'}>
        <Title mb={headerSubtitle ? '6px' : '0px'}>{headerTitle}</Title>
        <Subtitle>{headerSubtitle}</Subtitle>
      </TextContainer>
      <ConditionalWrapper
        condition={animationsEnabled}
        wrapper={children => (
          <motion.div whileHover={{ scale: 1.2 }}>{children}</motion.div>
        )}
      >
        <CloseHeader onClick={props.onCloseClick}>⨯</CloseHeader>
      </ConditionalWrapper>
    </Header>
  )
}

export const WebchatHeader = props => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)

  const handleCloseWebchat = event => {
    props.onCloseClick(event.target.value)
  }
  const CustomHeader = getThemeProperty('header.custom')
  if (CustomHeader) {
    return <CustomHeader onCloseClick={handleCloseWebchat} />
  }
  return (
    <DefaultHeader
      webchatState={webchatState}
      getThemeProperty={getThemeProperty}
      color={getThemeProperty('brand.color', COLORS.BOTONIC_BLUE)}
      onCloseClick={handleCloseWebchat}
    />
  )
}

export const StyledWebchatHeader = styled(WebchatHeader)`
  border-radius: 8px 8px 0px 0px;
  box-shadow: ${COLORS.PIGEON_POST_BLUE_ALPHA_0_5} 0px 2px 5px;
  height: 36px;
  flex: none;
`
