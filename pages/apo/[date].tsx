import React from 'react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { APODResponse, fetchAPOOfDate } from '../../services/apod'

export async function getStaticPaths() {
  // generate list of 10 dates in format YYYY-MM-DD
  const dates = Array.from({ length: 100 }, (_, i) => {
    return DateTime.now().minus({ days: i }).toFormat('yyyy-MM-dd')
  })
  const paths = dates.map((date) => ({
    params: { date },
  }))
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps(context: { params: { date: string } }) {
  const apod = await fetchAPOOfDate({
    date: DateTime.fromISO(context.params.date),
  })

  return {
    props: { apod },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}

export default function Home({ apod }: { apod: APODResponse }) {
  return (
    <APOD
      url={apod.url}
      title={apod.title}
      date={apod.date}
      description={apod.explanation}
    />
  )
}

function APOD({
  url,
  title,
  date,
  description,
}: {
  url: string
  title: string
  date: string
  description: string
}) {
  return (
    <div className="relative p-5">
      <Link href={'/'}>
        <img className="m-auto" src={url} alt={title} />
      </Link>
      <div className="absolute top-5 left-5">
        <div className="p-2 text-xl text-gray-200">{title}</div>
        <div className="p-2 text-gray-400">{date}</div>
      </div>
      <div className="p-2 text-justify text-white">{description}</div>
    </div>
  )
}
