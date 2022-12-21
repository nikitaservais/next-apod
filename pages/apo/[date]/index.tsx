import { APODResponse, fetchAPOOfDate } from "../../api/apod";
import React from "react";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

export async function getStaticPaths() {
  // generate list of 10 dates in format YYYY-MM-DD
  const dates = Array.from({ length: 30 }, (_, i) => {
    return DateTime.now().minus({ days: i }).toFormat("yyyy-MM-dd");
  });
  const paths = dates.map((date) => ({
    params: { date },
  }));
  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: { params: { date: string } }) {
  const apod = await fetchAPOOfDate({
    date: DateTime.fromISO(context.params.date),
  });

  return {
    // Passed to the page component as props
    props: { apod },
  };
}

export default function Home({ apod }: { apod: APODResponse }) {
  return (
    <APOD
      url={apod.url}
      title={apod.title}
      date={apod.date}
      description={apod.explanation}
    />
  );
}

function APOD({
  url,
  title,
  date,
  description,
}: {
  url: string;
  title: string;
  date: string;
  description: string;
}) {
  const route = useRouter();
  return (
    <div className="relative p-5" onClick={() => route.push("/")}>
      <img className="m-auto" src={url} alt={title} />
      <div className="absolute top-5 left-5">
        <div className="p-2 text-xl text-gray-200">{title}</div>
        <div className="p-2 text-gray-400">{date}</div>
      </div>
      <div className="p-2 text-justify text-white">{description}</div>
    </div>
  );
}
