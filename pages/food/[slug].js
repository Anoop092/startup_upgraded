import React from "react";

import client from "../../utils/client";
import { AnimalDetails, Layout } from "../../components";
import Link from "next/link";
import FoodDetail from "../../components/FoodDetail";

const Detail = ({ food }) => {
  return (
    <Layout title="details">
      {food ? (
        <FoodDetail food={food} />
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
  const food = await client.fetch(
    `
  *[_type=="food" && slug.current == $slug ][0]
  `,
    { slug }
  );
  return {
    props: {
      food,
    },
  };
}

export default Detail;
