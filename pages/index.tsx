import Image from 'next/image'
import {APODResponse, fetchAPOD, MEDIA_TYPES} from './api/apod'

function RenderMedia({
                       mediaType,
                       url,
                     }: { mediaType: MEDIA_TYPES, url: string }) {
  switch (mediaType) {
    case MEDIA_TYPES.IMAGE:
      return (<Image alt="new" src={url} width={200} height={200}/>)
    case MEDIA_TYPES.VIDEO:
      return (
        <iframe src={url} width={200} height={200} allowFullScreen={true}/>)
  }
}

function APO({title, description, media, mediaType}: {
  title: string, description: string, media: string, mediaType: MEDIA_TYPES
}) {
  return (
    <div>
      <div>{title}</div>
      <RenderMedia mediaType={mediaType} url={media}/>
      <div>{description}</div>
    </div>
  )
}

export async function getStaticProps() {
  const apod = await fetchAPOD()
  return {
    props: {
      apod,
    },
  }
}

export default function Home({apod}: { apod: APODResponse }) {
  return <APO title={apod.title} description={apod.explanation}
              media={apod.url}
              mediaType={apod.media_type}/>
}