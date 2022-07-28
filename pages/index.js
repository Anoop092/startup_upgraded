import axios from "axios";
import React, { useEffect, useState } from "react";
import { Layout } from "../components";
import Animals from "../components/Animals";
import client from "../utils/client";

const Home = ({ animals }) => {
  return (
    <Layout title="Home Page">
      <Animals animals={animals} />
    </Layout>
  );
};
export async function getServerSideProps() {
  const data = await client.fetch(`*[_type == "animal"]`);

  return {
    props: {
      animals: data,
    },
  };
}
export default Home;
