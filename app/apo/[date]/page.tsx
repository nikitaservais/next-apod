import React from 'react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { fetchAPOOfDate, MEDIA_TYPES } from '../../../services/apod'

export const dynamicParams = true

export default async function APOD({ params }: { params: { date: string } }) {
  const apod = await fetchAPOOfDate({
    date: DateTime.fromISO(params.date),
  })

  return (
    <div className="relative p-5">
      <Link href={'/'}>
        {apod.media_type === MEDIA_TYPES.IMAGE && (
          <img className="m-auto" src={apod.url} alt={apod.title} />
        )}
      </Link>
      {apod.media_type === MEDIA_TYPES.VIDEO &&
        (apod.url.endsWith('.mp4') ? (
          <video className="m-auto w-full" src={apod.url} controls />
        ) : (
          <iframe
            className="m-auto aspect-video w-full"
            src={apod.url}
            allowFullScreen={true}
          />
        ))}
      <div className="absolute top-5 left-5">
        <div className="p-2 text-xl text-gray-200">{apod.title}</div>
        <div className="p-2 text-gray-400">{apod.date}</div>
      </div>
      <div className="p-2 text-justify text-white">{apod.explanation}</div>
    </div>
  )
}
