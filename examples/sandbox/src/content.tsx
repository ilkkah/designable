import React from 'react'
import { ComponentTreeWidget, useTreeNode } from '@aamuapp/designable-react'
import { observer } from '@formily/reactive-react'

const components = {
  Field: observer((props: any) => {
    const node = useTreeNode()
    return (
      <span
        {...props}
        style={{
          background: '#eee',
          display: 'inline-block',
          ...props.style,
          padding: '10px 20px',
          border: '1px solid #ddd',
        }}
      >
        <span data-content-editable="title">{node.props.title}</span>
        {props.children}
      </span>
    )
  }),
  Card: (props: any) => {
    return (
      <div
        {...props}
        style={{
          background: '#eee',
          border: '1px solid #ddd',
          display: 'flex',
          padding: 10,
          height: props.children ? 'auto' : 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {props.children ? props.children : <span>拖拽字段进入该区域</span>}
      </div>
    )
  },
}

export const Content = () => {
  return <ComponentTreeWidget components={components} />
}
