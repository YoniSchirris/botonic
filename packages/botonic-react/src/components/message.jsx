import React, { useState, useEffect, useContext } from 'react'
import uuid from 'uuid/v4'
import { isBrowser, isNode } from '@botonic/core'
import { staticAsset, getProperty } from '../utils'
import { WebchatContext, RequestContext } from '../contexts'
import { Button } from './button'
import { Reply } from './reply'
import Logo from '../assets/botonic_react_logo100x100.png'

export const Message = props => {
  const { defaultTyping, defaultDelay } = useContext(RequestContext)
  const {
    type = '',
    blob = true,
    from = 'bot',
    delay = defaultDelay,
    typing = defaultTyping,
    children,
    json,
    style,
    ...otherProps
  } = props

  const {
    webchatState,
    addMessage,
    updateReplies,
    getThemeProperty
  } = useContext(WebchatContext)
  const { theme } = webchatState
  const [state, setState] = useState({
    id: props.id || uuid()
  })

  const replies = React.Children.toArray(children).filter(e => e.type === Reply)
  const buttons = React.Children.toArray(children).filter(
    e => e.type === Button
  )
  const textChildren = React.Children.toArray(children).filter(
    e => ![Button, Reply].includes(e.type)
  )
  if (isBrowser()) {
    useEffect(() => {
      let decomposedChildren = json
      let message = {
        id: state.id,
        type,
        data: decomposedChildren ? decomposedChildren : textChildren,
        from,
        buttons: buttons.map(b => ({
          payload: b.props.payload,
          path: b.props.path,
          url: b.props.url,
          title: b.props.children
        })),
        delay,
        typing,
        replies: replies.map(r => ({
          payload: r.props.payload,
          path: r.props.path,
          url: r.props.url,
          text: r.props.children
        })),
        display: delay + typing == 0
      }
      addMessage(message)
    }, [])

    useEffect(() => {
      let msg = webchatState.messagesJSON.find(m => m.id === state.id)
      if (
        msg &&
        msg.display &&
        webchatState.messagesJSON.filter(m => !m.display).length == 0
      ) {
        updateReplies(replies)
      }
    }, [webchatState.messagesJSON])
  }

  const isFromUser = () => from === 'user'
  const isFromBot = () => from === 'bot'
  const getBgColor = () => {
    if (!blob) return 'transparent'
    return isFromUser() ? getThemeProperty('brand.color') : '#F1F0F0'
  }

  const getMessageStyle = () =>
    isFromBot()
      ? getThemeProperty('message.bot.style') || {}
      : getThemeProperty('message.user.style') || {}

  const renderBrowser = () => {
    let m = webchatState.messagesJSON.find(m => m.id === state.id)
    if (!m || !m.display) return <></>
    let pointerSize = 6
    let pointerStyles = {
      position: 'absolute',
      top: '50%',
      width: 0,
      height: 0,
      border: `${pointerSize}px solid transparent`,
      marginTop: -pointerSize
    }

    let BotMessageImage = Logo
    // In this condition we look for 'brand.image' or 'brandImage' to exist and to have value (which can be null)
    if (getProperty(theme, 'brand.image') || getProperty(theme, 'brandImage')) {
      BotMessageImage = getThemeProperty('brand.image')
    }
    if (
      getProperty(theme, 'bot.message.image') ||
      getProperty(theme, 'botMessageImage')
    )
      BotMessageImage = getThemeProperty('message.bot.image')

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: isFromUser() ? 'flex-end' : 'flex-start',
          position: 'relative',
          paddingLeft: 5
        }}
      >
        {isFromBot() && BotMessageImage && (
          <div
            style={{
              width: 28,
              padding: 4,
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img style={{ width: '100%' }} src={staticAsset(BotMessageImage)} />
          </div>
        )}

        <div
          style={{
            position: 'relative',
            margin: 8,
            fontFamily: 'Arial, Helvetica, sans-serif',
            borderRadius: 8,
            backgroundColor: getBgColor(),
            color: isFromUser() ? '#FFF' : '#000',
            border: `1px solid ${getBgColor()}`,
            maxWidth: blob ? '60%' : 'calc(100% - 16px)',
            ...getMessageStyle(),
            ...style
          }}
          {...otherProps}
        >
          <div
            style={{
              padding: '8px 12px',
              display: 'flex',
              flexDirection: 'column',
              whiteSpace: 'pre-line'
            }}
          >
            {textChildren}
          </div>
          {buttons}
          {isFromUser() && blob && (
            <div
              style={{
                ...pointerStyles,
                borderLeftColor: getBgColor(),
                right: 0,
                borderRight: 0,
                marginRight: -pointerSize
              }}
            />
          )}
          {isFromBot() && blob && (
            <div
              style={{
                ...pointerStyles,
                borderRightColor: getBgColor(),
                left: 0,
                borderLeft: 0,
                marginLeft: -pointerSize
              }}
            />
          )}
        </div>
      </div>
    )
  }

  let { blob: _blob, json: _json, ...nodeProps } = props
  const renderNode = () =>
    type === 'custom' ? (
      <message json={JSON.stringify(_json)} {...nodeProps} />
    ) : (
      <message {...nodeProps}>{children}</message>
    )

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
