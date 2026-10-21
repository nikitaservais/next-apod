import { DateTime } from 'luxon'

// The api.nasa.gov APOD endpoint broke when APOD moved to science.nasa.gov:
// it now returns a NASA logo placeholder for every date. We read the APOD
// posts straight from the science.nasa.gov WordPress API instead.
const APOD_POSTS_URL = 'https://science.nasa.gov/wp-json/wp/v2/image-article'
const APOD_CATEGORY_ID = 22766

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

type APODPost = {
  date: string
  title: { rendered: string }
  content: { rendered: string }
  featured_image_url?: string
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|\w+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code =
        entity[1].toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return Number.isNaN(code) ? match : String.fromCodePoint(code)
    }
    return ENTITIES[entity.toLowerCase()] ?? match
  })
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim()
}

function toAPOD(post: APODPost): APODResponse {
  const content = post.content.rendered
  const video =
    content.match(/<source[^>]*src="([^"]+)"/)?.[1] ??
    content.match(/<iframe[^>]*src="([^"]+)"/)?.[1]
  const image = post.featured_image_url ?? ''
  const explanation =
    content.match(/media-detail-hero__description[^>]*>([\s\S]*?)<\/p>/)?.[1] ??
    ''

  return {
    // Titles look like "APOD: 2026 October 20 – An Anticrepuscular Rainbow Fan"
    title: stripTags(post.title.rendered).replace(/^APOD:.*?\s[–-]\s/, ''),
    explanation: stripTags(explanation).replace(/^Explanation:\s*/, ''),
    date: post.date.slice(0, 10),
    copyright: '',
    media_type: video ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.IMAGE,
    url: decodeEntities(video ?? image),
    hdurl: decodeEntities(image),
  }
}

function fetchAPODPosts(params: Record<string, string>): Promise<APODResponse[]> {
  const query = new URLSearchParams({
    categories: String(APOD_CATEGORY_ID),
    _fields: 'date,title,content,featured_image_url',
    ...params,
  })
  return fetch(`${APOD_POSTS_URL}?${query}`)
    .then((res) => {
      if (!res.ok) throw new Error(`APOD request failed: ${res.status}`)
      return res.json()
    })
    .then((posts: APODPost[]) => posts.map(toAPOD))
}

export function fetchAPOOfDate({
  date,
}: {
  date: DateTime
}): Promise<APODResponse> {
  return fetchAPOFromTo({ from: date, to: date }).then((apos) => {
    const apo = apos.find((a) => a.date === date.toISODate())
    if (!apo) throw new Error(`No APOD found for ${date.toISODate()}`)
    return apo
  })
}

export function fetchAPOD(): Promise<APODResponse> {
  return fetchAPODPosts({ per_page: '1' }).then((apos) => apos[0])
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
  // `after` and `before` are exclusive, so widen the range by a day each side
  return fetchAPODPosts({
    after: `${to.minus({ days: 1 }).toISODate()}T23:59:59`,
    before: `${from.plus({ days: 1 }).toISODate()}T00:00:00`,
    per_page: '100',
  }).catch((err) => {
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
