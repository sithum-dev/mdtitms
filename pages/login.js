import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import { useRef, useState } from "react";
import { setCookie } from "nookies";

function Login() {
  const router = useRouter();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    setLoading(false);

    if (res.login === true) {
      if (res.data.user.role == "branch") {
        setCookie(null, "loginOfficeId", res.data.user.officeId._id, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        setCookie(null, "userRole", res.data.user.role, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        router.push("/dashboard/office");
      } else {
        setCookie(null, "userRole", "admin", {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        router.push("/");
      }
    } else {
      setError(409);
    }
  };

  return (
    <div className="bg-gradient-to-tl from-blue-400 to-blue-900 h-screen flex justify-center items-center">
      <Head>
        <title>MDTIMS - Login</title>
      </Head>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-gray-300 rounded-lg">
        <div className="p-2">
          <img className="h-80 md:h-96" src="./images/main-img.png" alt="" />
        </div>
        <div className="bg-white rounded-b-lg md:rounded-r-lg flex flex-col justify-center items-center p-3">
          {/* Logo */}
          <div className="my-2 text-center">
            {/* <img
              className="h-14 md:h-16 cursor-pointer"
              src="/images/logo-dark.svg"
              alt=""
            /> */}
            <h1 className="text-3xl font-bold">MDTIMS</h1>
            <h1 className="text-xl font-semibold">Login</h1>
          </div>
          {/* Logo bottom line */}
          <div className="bg-gradient-dark h-1 w-9 rounded-full"></div>

          {/* Alert */}
          <div
            className={
              error == 409
                ? "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full mt-4 transition duration-300 ease-in-out"
                : "hidden"
            }
            role="alert"
          >
            <span className="block sm:inline text-sm">
              Incorrect username or password.
            </span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
          {/* Input box */}
          <form onSubmit={onSubmit}>
            <div className="my-4 px-7">
              <div className="flex items-baseline gap-1 text-sm mx-3">
                <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
                Username
              </div>
              <input
                className="w-64 bg-gray-300 rounded-full my-2 px-4 py-2 text-sm outline-none"
                type="text"
                name="username"
                id="username"
                placeholder="Your username here"
                ref={usernameRef}
                required
              />
              <div className="flex items-baseline gap-1 text-sm mx-3">
                <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
                Password
              </div>
              <input
                className="w-64 bg-gray-300 rounded-full my-2 px-4 py-2 text-sm outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="Your Password here"
                ref={passwordRef}
                required
              />
              <div className="text-center mt-4">
                <button
                  className={
                    loading
                      ? "bg-gray-500 text-white px-10 py-2 text-sm rounded-full cursor-wait"
                      : "bg-gradient-dark text-white px-10 py-2 text-sm rounded-full"
                  }
                  type="submit"
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  const { cookies } = req;

  if (!cookies.token) {
    return {
      props: {
        token: null,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
}
