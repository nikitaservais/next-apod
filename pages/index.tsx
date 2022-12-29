import {
  APODResponse,
  fetchAPODs,
  fetchNextAPOs,
  MEDIA_TYPES,
} from "./api/apod";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DateTime } from "luxon";
import Link from "next/link";

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
  );
}

export async function getStaticProps() {
  console.log("getStaticProps", DateTime.now().toMillis());
  const apos = await fetchAPODs();
  return {
    props: {
      apos,
    },
    revalidate: 3600,
  };
}

export default function Home({ apos }: { apos: APODResponse[] }) {
  // create state for apos
  console.log("Home", DateTime.now().toMillis());
  return <ApoList apos={apos} />;
}
