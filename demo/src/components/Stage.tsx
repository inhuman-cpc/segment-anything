// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext } from 'react'
import * as _ from 'underscore'
import Tool from './Tool'
import { modelInputProps } from './helpers/Interfaces'
import AppContext from './hooks/createContext'

const Stage = ({ isReady }: {isReady: boolean}) => {
  const {
    clicks: [clicks, setClicks],
    image: [image]
  } = useContext(AppContext)!

  const getClick = (x: number, y: number, clickType: number): modelInputProps => {
    return { x, y, clickType }
  }

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  const handleMouseClick = _.debounce((e: any) => {
    const el = e.nativeEvent.target
    const rect = el.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    const imageScale = image ? image.width / el.offsetWidth : 1
    x *= imageScale
    y *= imageScale
    // Right click generates negative points
    const click = getClick(x, y, e.button === 0 ? 1 : 0)
    console.log('Current clicks:')
    console.log(clicks)
    console.log('Current click:')
    console.log(click)
    if (click) setClicks((clicks) => clicks ? [...clicks, click] : [click])
  }, 500)

  const flexCenterClasses = 'flex items-center justify-center'
  const list = ['dogs', 'girl-1', 'girl-2', 'girl-3'].map(name => {
    return (
      <li key={name} className="p-[10px]">
        <a href={`/?${name}`}>
          <img src={`https://static-1251297012.file.myqcloud.com/ai-test/data/${name}.jpg`} className="w-[64px]" />
        </a>
      </li>
    )
  })

  return (
    <div className={`${flexCenterClasses} w-full h-full`}>
      <div className="flex absolute top-[20%] left-[16px]">
        <ul>{list}</ul>
      </div>
      <div className={`${flexCenterClasses} relative w-[90%] h-[90%]`}>
        {isReady ? <Tool handleMouseClick={handleMouseClick} /> : 'Loading model and embedding ...'}
      </div>
    </div>
  )
}

export default Stage
