import { DateTime } from 'luxon'

const api_key = process.env.APOD_API_KEY

export enum MEDIA_TYPES {
  IMAGE = 'image',
  VIDEO = 'video',
}

export type APODResponse = {
  title: string
  explanation: string
  date: string
  copyright: string
  media_type: MEDIA_TYPES
  url: string
  hdurl: string
}

export function fetchAPOOfDate({
  date,
}: {
  date: DateTime
}): Promise<APODResponse> {
  return fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${date.toISODate()}`,
    { cache: 'force-cache' }
  )
    .then((res) => res.json())
    .then((data) => {
      return data
    })
}

export function fetchAPOD(): Promise<APODResponse> {
  return fetch(`https://api.nasa.gov/planetary/apod?api_key=${api_key}`, {
    cache: 'force-cache',
  })
    .then((res) => res.json())
    .then((data) => {
      data.media_type = data.media_type as MEDIA_TYPES
      return data
    })
}

export function fetchAPODs(): Promise<APODResponse[]> {
  const today = DateTime.now()
  return fetchAPOFromTo({ from: today, to: today.minus({ days: 10 }) })
}

export function fetchAPOFromTo({
  from,
  to,
}: {
  from: DateTime
  to: DateTime
}): Promise<APODResponse[]> {
  console.log('fetchAPOFromTo', from.toISODate(), to.toISODate())
  return fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${api_key}&start_date=${to.toISODate()}&end_date=${from.toISODate()}`
  )
    .then((res) => res.json())
    .then((data) => {
      return data.reverse()
    })
    .catch((err) => {
      console.log(err)
      return []
    })
}

export function fetchNextAPOs({
  date,
  count,
}: {
  date: string
  count: number
}): Promise<APODResponse[]> {
  const dateF = DateTime.fromISO(date)
  return fetchAPOFromTo({
    from: dateF.minus({ days: 1 }),
    to: dateF.minus({ days: count + 1 }),
  })
}
