import React from "react";

import client from "../../utils/client";
import { AnimalDetails, Layout } from "../../components";
import Link from "next/link";

const Detail = ({ animal }) => {
  return (
    <Layout title="details">
      {animal ? (
        <AnimalDetails animal={animal} />
      ) : (
        <div className="flex flex-col">
          <div>
            <Link href="/">Back to Home</Link>
          </div>
          <p>oops! no animals available</p>
        </div>
      )}
    </Layout>
  );
};
export async function getServerSideProps(ctx) {
  const { params } = ctx;
  const { slug } = params;
  const animal = await client.fetch(
    `
  *[_type=="animal" && slug.current == $slug ][0]
  `,
    { slug }
  );
  return {
    props: {
      animal: animal,
    },
  };
}

export default Detail;
