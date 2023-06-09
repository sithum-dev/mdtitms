import Head from "next/head";
import Header from "../../components/Header";
import AOS from "aos";
import { useEffect } from "react";
import NavBar from "../../components/NavBar";
import UsersSection from "../../components/users/user-section";
import UserDetails from "../../components/users/dashboard";
import { userAuth } from "../../hooks/adminUserAuth";
import { ToastContainer } from "react-toastify";

export default function Office() {
  return (
    <div className="flex flex-col min-h-screen font-rubik">
      <Head>
        <title>MDTIMS</title>
        {/* <link rel="icon" href="/favicon.png" /> */}
      </Head>

      {/* Header */}
      <Header />
      {/* Nav Bar */}
      <NavBar />
      <main className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* User select & chat */}
        <UsersSection />
        {/* User Details */}
        <UserDetails />
      </main>
      <ToastContainer />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx;
  const { cookies } = req;

  if (!cookies.token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  } else {
    return {
      props: {
        token: cookies.token,
      },
    };
  }
}
