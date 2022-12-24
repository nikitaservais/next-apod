// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DateTime } from "luxon";
import { NextApiResponse } from "next";

const api_key = process.env.APOD_API_KEY;

export enum MEDIA_TYPES {
  IMAGE = "image",
  VIDEO = "video",
}

export type APODResponse = {
  title: string;
  explanation: string;
  date: string;
  copyright: string;
  media_type: MEDIA_TYPES;
  url: string;
  hdurl: string;
};

export const aposCache: APODResponse[] = [];

export function fetchAPOOfDate({
  date,
}: {
  date: DateTime;
}): Promise<APODResponse> {
  const cacheApo = aposCache.find((apod) => apod.date === date.toISODate());
  if (cacheApo) {
    console.log("cache hit apo of date", date.toISODate());
    return Promise.resolve(cacheApo);
  }
  return fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${date.toISODate()}`
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

export function fetchAPOD(): Promise<APODResponse> {
  return fetch(`https://api.nasa.gov/planetary/apod?api_key=${api_key}`)
    .then((res) => res.json())
    .then((data) => {
      data.media_type = data.media_type as MEDIA_TYPES;
      return data;
    });
}

export function fetchAPODs(): Promise<APODResponse[]> {
  if (
    aposCache.length > 0 &&
    aposCache.find((apod) => apod.date === DateTime.now().toISODate())
  ) {
    console.log("cache hit", DateTime.now().toMillis());
    return Promise.resolve(aposCache);
  }
  console.log("cache missed", DateTime.now().toMillis());

  const today = DateTime.now();
  return fetchAPOFromTo({ from: today, to: today.minus({ days: 10 }) });
}

export function fetchAPOFromTo({
  from,
  to,
}: {
  from: DateTime;
  to: DateTime;
}): Promise<APODResponse[]> {
  return fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${api_key}&start_date=${to.toISODate()}&end_date=${from.toISODate()}`
  )
    .then((res) => res.json())
    .then((data) => {
      const reversedData = data.reverse();
      aposCache.push(...reversedData);
      return reversedData;
    });
}

export function fetchNextAPOs({
  date,
  count,
}: {
  date: string;
  count: number;
}): Promise<APODResponse[]> {
  const dateF = DateTime.fromISO(date);
  return fetchAPOFromTo({
    from: dateF.minus({ days: 1 }),
    to: dateF.minus({ days: count + 1 }),
  });
}

export default function handler({ res }: { res: NextApiResponse }) {
  // fetch APOD data from NASA API
  fetchAPOD().then((data) => {
    res.status(200).json(data);
  });
}
