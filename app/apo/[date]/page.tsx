import React from 'react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { fetchAPOOfDate } from '../../../services/apod'

export const dynamicParams = true

export default async function APOD({ params }: { params: { date: string } }) {
  const apod = await fetchAPOOfDate({
    date: DateTime.fromISO(params.date),
  })

  return (
    <div className="relative p-5">
      <Link href={'/'}>
        <img className="m-auto" src={apod.url} alt={apod.title} />
      </Link>
      <div className="absolute top-5 left-5">
        <div className="p-2 text-xl text-gray-200">{apod.title}</div>
        <div className="p-2 text-gray-400">{apod.date}</div>
      </div>
      <div className="p-2 text-justify text-white">{apod.explanation}</div>
    </div>
  )
}
