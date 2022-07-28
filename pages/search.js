import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Animals, Layout } from "../components";

import client from "../utils/client";
import { getError } from "../utils/error";
const SearchScreen = () => {
  const { query } = useRouter();
  const [state, setState] = useState({
    loading: true,
    err: "",
    animals: [],
  });

  const { category = "all", breed = "all" } = query;
  const { loading, err, animals } = state;
  useEffect(() => {
    const fetchData = async () => {
      let data;
      try {
        if (breed !== "all") {
          setState({ loading: true, err: "", animals: [] });
          data = await client.fetch(
            `*[_type=="animal" && breed match "${breed}"]`
          );

          setState({ loading: false, err: "", animals: data });
        }
        if (category !== "all") {
          setState({ loading: true, err: "", animals: [] });

          data = await client.fetch(
            `*[_type=="animal" && category match "${category}" ]`
          );
          setState({ loading: false, err: "", animals: data });
        }
      } catch (error) {
        console.log(error);
        setState({ loading: false, err: getError(error), animals: [] });
      }
    };
    fetchData();
  }, [breed, category, query]);
  return (
    <Layout title="Searched  items">
      {loading ? (
        <div>Loading...</div>
      ) : err ? (
        <div>{err}</div>
      ) : (
        <Animals animals={animals} />
      )}
    </Layout>
  );
};

export default SearchScreen;
