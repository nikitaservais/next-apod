// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const api_key = process.env.APOD_API_KEY

export enum MEDIA_TYPES {
  IMAGE = 'image',
  VIDEO = 'video',
}

export type APODResponse = {
  title: string
  explanation: string,
  date: string,
  copyright: string,
  media_type: MEDIA_TYPES,
  url: string,
  hdurl: string,
}

function fetchAPODOfDate({date}: { date: string }): Promise<APODResponse> {
  return fetch(`https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${date}`)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
}

export function fetchAPOD(): Promise<APODResponse> {
  return fetch(`https://api.nasa.gov/planetary/apod?api_key=${api_key}`)
    .then((res) => res.json())
    .then((data) => {
      data.media_type = data.media_type as MEDIA_TYPES
      return data
    })
}

export default function handler({req, res}: { req: any, res: any }) {
  // fetch APOD data from NASA API
  fetchAPOD().then((data) => {
    res.status(200).json(data)
  })
}
