import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const SideBar = ({ children }) => {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/category");
      setCategory(data);
    };
    fetchData();
  }, []);
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <h3 className="text-xl text-purple-400 underline">Category</h3>
          {category.map((item) => {
            return (
              <li key={item}>
                <Link href={`/search?category=${item}`}>
                  <a>{item}</a>
                </Link>
              </li>
            );
          })}
          <h3 className="text-xl text-purple-400 underline">Products</h3>
          <li>
            <a>Beauty Products</a>
          </li>
          <li>
            <Link href="/food">
              <a>Food</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
