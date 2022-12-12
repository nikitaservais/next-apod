import Image from "next/image";
import {
  APODResponse,
  fetchAPODs,
  fetchNextAPOs,
  MEDIA_TYPES,
} from "./api/apod";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function RenderMedia({
  mediaType,
  url,
}: {
  mediaType: MEDIA_TYPES;
  url: string;
}) {
  switch (mediaType) {
    case MEDIA_TYPES.IMAGE:
      return <Image alt="new" src={url} width={200} height={200} />;
    case MEDIA_TYPES.VIDEO:
      return (
        <iframe src={url} width={200} height={200} allowFullScreen={true} />
      );
  }
}

function APO({
  title,
  media,
  mediaType,
  date,
}: {
  title: string;
  media: string;
  mediaType: MEDIA_TYPES;
  date: string;
}) {
  return (
    <div className="m-auto max-w-[600px] p-10">
      <div>
        <div
          className="h-[400px] rounded bg-cover bg-center"
          style={{ backgroundImage: `url(${media})` }}
        >
          <div className=" p-2 text-white">{title}</div>
          <div className="p-2 text-white">{date}</div>
        </div>
      </div>
    </div>
  );
}

function ApoList({ apos }: { apos: APODResponse[] }) {
  const [items, setItems] = useState(apos);
  const [hasMore, setHasMore] = useState(true);

  const getMoreApos = async () => {
    const newApos = await fetchNextAPOs({
      date: items[items.length - 1].date,
      count: 10,
    });
    setItems([...items, ...newApos]);
    setHasMore(newApos.length > 0);
  };
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
            <APO
              title={data.title}
              media={data.url}
              mediaType={data.media_type}
              date={data.date}
            />
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
}

export async function getStaticProps() {
  const apos = await fetchAPODs();
  return {
    props: {
      apos,
    },
  };
}

export default function Home({ apos }: { apos: APODResponse[] }) {
  return <ApoList apos={apos} />;
}
