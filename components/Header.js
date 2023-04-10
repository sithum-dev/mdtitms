import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/dist/client/router";

function Header() {
  const router = useRouter();
  const [top, setTop] = useState(true);

  /**
   * It sends a POST request to the server, which then logs the user out and redirects them to the login
   * page.
   */
  const logOutHandler = async () => {
    await fetch("/api/auth/logOut", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    router.push("/login");
  };

  /* A hook that is used to detect when the user scrolls. */
  useEffect(() => {
    let prevScrollpos = window.pageYOffset;
    const scrollHandler = () => {
      window.pageYOffset > prevScrollpos && window.pageYOffset > 10
        ? setTop(false)
        : setTop(true);
      prevScrollpos = window.pageYOffset;
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 bg-gradient-dark transition duration-300 ease-in-out ${
        !top && "opacity-0"
      }`}
    >
      <div className="container mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Site branding */}
          <div className="flex-shrink-0 mr-4">
            {/* Logo */}
            <Link href="/" className="block" aria-label="Cruip">
              <div className="flex gap-2">
                {/* <img
                  className="h-10 md:h-12 cursor-pointer"
                  src="/logo.svg"
                  alt=""
                />
                <img
                  className="h-10 md:h-12 cursor-pointer"
                  src="/images/logo.svg"
                  alt=""
                /> */}
                <h1 className="text-3xl font-semibold text-white">MDTIMS</h1>
              </div>
            </Link>
          </div>

          {/* Site navigation */}
          <nav className="contents md:flex flex-grow justify-end ml-40 flex-wrap items-center gap-2">
            <div className="flex gap-2">
              <button className="button-icon" onClick={logOutHandler}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15.725"
                  height="19.82"
                  viewBox="0 0 15.725 19.82"
                >
                  <defs>
                    <linearGradient
                      id="linear-gradient"
                      x1="0.21"
                      y1="-0.182"
                      x2="2.868"
                      y2="2.285"
                      gradientUnits="objectBoundingBox"
                    >
                      <stop offset="0" stopColor="#1e1e31" />
                      <stop offset="1" stopColor="#dd2d5b" />
                    </linearGradient>
                  </defs>
                  <path
                    id="Intersection_2"
                    data-name="Intersection 2"
                    d="M5,19.976V16.943a1.491,1.491,0,0,1,.562-1.167,25.879,25.879,0,0,1,4.609-2.861.14.14,0,0,0,.079-.125V11.311A3.457,3.457,0,0,1,9.8,10.126c-.17-.013-.4-.245-.64-1.074C8.854,8,9.131,7.782,9.412,7.777c-.023-.089-.046-.182-.064-.272a3.151,3.151,0,0,1-.009-1.493,3.257,3.257,0,0,1,.9-1.529,4.228,4.228,0,0,1,.833-.668,3.31,3.31,0,0,1,.811-.4,3.011,3.011,0,0,1,.736-.134,3.123,3.123,0,0,1,1.847.379,2.3,2.3,0,0,1,.9.811s1.5.1.99,3.039a1.9,1.9,0,0,1-.064.272c.285,0,.575.214.262,1.279-.244.829-.469,1.06-.64,1.074a3.4,3.4,0,0,1-.447,1.185V12.8a.133.133,0,0,0,.079.125,25.223,25.223,0,0,1,4.609,2.861,1.533,1.533,0,0,1,.571,1.158v3.141A11.64,11.64,0,0,1,5,19.976Z"
                    transform="translate(-5 -3.268)"
                    fill="url(#linear-gradient)"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
