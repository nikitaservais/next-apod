'use client'
import { APODResponse, fetchNextAPOs, MEDIA_TYPES } from '../services/apod'
import Link from 'next/link'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

function APO({
  title,
  media,
  mediaType,
  date,
}: {
  title: string
  media: string
  mediaType: MEDIA_TYPES
  date: string
}) {
  return (
    <div className="m-auto max-w-[600px] p-10">
      <div>
        {mediaType === MEDIA_TYPES.IMAGE ? (
          <Link href={`/apo/${date}`}>
            <div
              className="h-[400px] rounded bg-cover bg-center"
              style={{ backgroundImage: `url(${media})` }}
            >
              <div className="p-2 text-white">{title}</div>
              <div className="p-2 text-white">{date}</div>
            </div>
          </Link>
        ) : (
          <div className="h-[400px] rounded bg-cover bg-center">
            <div className="p-2 text-white">{title}</div>
            <div className="p-2 text-white">{date}</div>
            <iframe
              className="h-full w-full"
              src={media}
              allowFullScreen={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function ApoList({ apos }: { apos: APODResponse[] }) {
  const [items, setItems] = useState(apos)
  const [hasMore, setHasMore] = useState(true)
  const getMoreApos = async () => {
    const newApos = await fetchNextAPOs({
      date: items[items.length - 1].date,
      count: 10,
    })
    setItems([...items, ...newApos])
    setHasMore(newApos.length > 0)
  }
  return (
    <>
      <InfiniteScroll
        dataLength={items.length}
        next={getMoreApos}
        hasMore={hasMore}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        {items.map((data) => (
          <div key={data.date}>
            <Link href={`/apo/${data.date}`}>
              <APO
                title={data.title}
                media={data.url}
                mediaType={data.media_type}
                date={data.date}
              />
            </Link>
          </div>
        ))}
      </InfiniteScroll>
    </>
  )
}
