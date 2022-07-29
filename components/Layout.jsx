import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Cookies from "js-cookie";
import { useRouter } from "next/router";

import DropdownLink from "./DropdownLink";
import SearchButton from "./SearchButton";
import Hamburger from "./Hamburger";
import SideBar from "./SideBar";
const Layout = ({ children, title }) => {
  const { state, dispatch } = useGlobalContext();
  const [count, setCount] = useState(0);
  const { cart } = state;
  const { userInfo } = state;
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let num = cart.cartItems.reduce((sum, cur) => sum + cur.quantity, 0);
    setCount(num);
  }, [cart.cartItems, router]);
  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);
  const logoutClickHandler = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cart");
    router.push("/");
  };

  return (
    <>
      <SideBar>
        <Head>
          <title>{title ? `${title}-Pet Care` : "Pet Care"}</title>
          <meta name="description" content="the pet-zone for pet lovers" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToastContainer position="bottom-center" limit={1} />
        <div className="flex flex-col min-h-screen justify-between">
          <header>
            <nav className="  navbar   bg-base-300">
              <div className="navbar-start">
                <Hamburger />
                <Link href="/">
                  <a className="btn btn-ghost normal-case text-xl">PET ZONE</a>
                </Link>
              </div>

              <div className="hidden md:block  md:flex-none md:navbar-center">
                <SearchButton />
              </div>

              <div className="navbar-end">
                <div className="navbar-center sm:flex-none md:hidden">
                  <div className="dropdown dropdown-end">
                    <label tabIndex="0" className="btn btn-ghost btn-circle">
                      <div className="indicator">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </label>
                    <div
                      tabIndex="0"
                      className="mt-3 card card-compact  dropdown-content bg-base-100 shadow"
                    >
                      <div className="card-body">
                        <div className="card-actions">
                          <SearchButton />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dropdown dropdown-end">
                  <label tabIndex="0" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {count > 0 && (
                        <span className="badge badge-sm badge-accent indicator-item">
                          {count}
                        </span>
                      )}
                    </div>
                  </label>
                  <div
                    tabIndex="0"
                    className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
                  >
                    <div className="card-body">
                      <span className="font-bold text-lg text-orange-500">
                        cart:{count}
                      </span>

                      <div className="card-actions">
                        <Link href="/cart">
                          <button className="btn btn-primary btn-block">
                            Cart
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {user ? (
                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex="0"
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full">
                        <img src="https://placeimg.com/80/80/people" />
                      </div>
                    </label>
                    <ul
                      tabIndex="0"
                      className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <DropdownLink
                          className="justify-between"
                          href="/profile"
                        >
                          Profile
                        </DropdownLink>
                      </li>
                      <li>
                        <DropdownLink href="/order-history">
                          Order History
                        </DropdownLink>
                      </li>
                      <li>
                        <a href="#" onClick={logoutClickHandler}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link href="/login">
                    <a className="text-xl p-2">Login</a>
                  </Link>
                )}
              </div>
            </nav>
          </header>
          <main className="container m-auto mt-4 px-4">{children}</main>
          <footer className="flex h-10 items-center justify-center shadow-md">
            {" "}
            <p>Copyright &copy; pet-zone</p>
          </footer>
        </div>
      </SideBar>
    </>
  );
};

export default Layout;
