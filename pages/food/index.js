import React from "react";
import { Layout } from "../../components";
import Food from "../../components/Food";
import client from "../../utils/client";

const FoodScreen = ({ foods }) => {
  return (
    <Layout title="food products">
      <Food foods={foods} />
    </Layout>
  );
};
export async function getServerSideProps() {
  const foods = await client.fetch(`*[_type=="food"]`);
  return {
    props: {
      foods,
    },
  };
}

export default FoodScreen;
