import React, { useEffect, useRef, useState } from 'react'

import UiVirtualScroll from './UiVirtualScroll'

const callApi = (offset, limit, props) => {
  return new Promise((resolve) => {
    const items = [];
    // for (let index = offset; index < offset + limit; index++) {
    //   items.push('label ' + index)
    // }

    // setTimeout(() => {
    //   resolve(items)
    // }, 500)
      props.socket.emit("getFile", props.fileId, offset < 0 ? 0 : offset , (offset < 0 ? 0 : offset) + limit);
      const messageListener = (message) => {
        items.push(...message.content);
        resolve(items)
        props.socket.off('getFileResp', messageListener)
      };  
      props.socket.on('getFileResp', messageListener);
  });
}

function FileReader(props) {
  const limit = 20
  // the number of items that we want to keep in memory - 300
  const buffer = limit * 3
  // the number of items that we want to cache when new chunk of data is loaded
  const cache = buffer - limit
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    if (props.fileId) {
      callApi(0, buffer, props).then((res) => {
        setItems(res)
        setIsLoading(false)
      })
    }
  }, [props.fileId])

  const prevCallback = (newOffset) => {
    setIsLoading(true)

    return callApi(newOffset, limit, props).then((res) => {
      const newItems = [...res, ...items.slice(0, cache)];
      setItems(newItems)
      setIsLoading(false)
      return true
    })
  }

  const nextCallback = (newOffset) => {
    setIsLoading(true)

    return callApi(newOffset, limit, props).then((res) => {
      const newItems = [...items.slice(-cache), ...res];
      setItems(newItems)
      setIsLoading(false)
      return true
    })
  }

  return (
    <div className="App">
      <UiVirtualScroll
        buffer={buffer}
        rowHeight={39}
        height="50vh"
        limit={limit}
        onPrevCallback={prevCallback}
        onNextCallback={nextCallback}
      >
        <>
          {items.map((item, index) => (
            <div style={{ padding: '10px' }}>
              {isLoading ? <>Loading...</> : item}
            </div>
          ))}
        </>
      </UiVirtualScroll>
    </div>
  )
}

export default FileReader