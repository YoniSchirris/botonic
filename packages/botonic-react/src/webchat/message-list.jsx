import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from './styled-scrollbar'
import { staticAsset } from '../utils'

export const WebchatMessageList = props => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)
  const CustomIntro = getThemeProperty('intro.custom')
  const introImage = getThemeProperty('intro.image')
  const introStyle = getThemeProperty('intro.style')
  const scrollbarOptions = getThemeProperty('scrollbar')
  const DefaultIntro = introImage && (
    <img
      style={{
        maxHeight: '50%',
        maxWidth: '100%',
        ...(introStyle || {})
      }}
      src={introImage && staticAsset(introImage)}
    />
  )

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions ? scrollbarOptions : undefined}
      data-simplebar-auto-hide={
        (scrollbarOptions && scrollbarOptions.autoHide) || true
      }
      style={{
        ...(props.style || {}),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {CustomIntro ? <CustomIntro /> : DefaultIntro}
      {webchatState.messagesComponents.map((e, i) => (
        <div
          style={{
            display: 'flex',
            overflowX: 'hidden',
            flexDirection: 'column',
            flex: 'none',
            whiteSpace: 'pre',
            wordWrap: 'break-word'
          }}
          key={i}
        >
          {e}
        </div>
      ))}
      {props.children}
    </StyledScrollbar>
  )
}
