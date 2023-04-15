import React, { useEffect, useRef, useState } from 'react'

import UiVirtualScroll from './UiVirtualScroll'

const callApi = (offset, limit, props) => {
  return new Promise((resolve) => {
    const items = [];
    for (let index = offset; index < offset + limit; index++) {
      items.push('label ' + index)
    }

    setTimeout(() => {
      resolve(items)
    }, 500)

    props.socket.emit("getFile", "client-folder/check1/logs.txt", offset, offset + limit);
    const messageListener = (message) => {
      items.push(...message.content);
    };  
    props.socket.on('getFileResp', messageListener);
  })
}

function FileReader() {
  const limit = 100
  // the number of items that we want to keep in memory - 300
  const buffer = limit * 3
  // the number of items that we want to cache when new chunk of data is loaded
  const cache = buffer - limit
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    callApi(0, buffer).then((res) => {
      setItems(res)
      setIsLoading(false)
    })
  }, [])

  const prevCallback = (newOffset) => {
    setIsLoading(true)

    return callApi(newOffset, limit).then((res) => {
      const newItems = [...res, ...items.slice(0, cache)];
      setItems(newItems)
      setIsLoading(false)
      return true
    })
  }

  const nextCallback = (newOffset) => {
    setIsLoading(true)

    return callApi(newOffset, limit).then((res) => {
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