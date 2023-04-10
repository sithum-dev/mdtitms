import Head from "next/head";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import MainContent from "../components/quotes";
function Quotes() {
  return (
    <div className="flex flex-col min-h-screen font-rubik">
      <Head>
        <title>LeanSL Admin</title>
        {/* <link rel="icon" href="/favicon.png" /> */}
      </Head>
      {/* Header */}
      <Header />
      {/* Nav Bar */}
      {/* <NavBar /> */}

      <main>
        <MainContent />
      </main>
    </div>
  );
}

export default Quotes;

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
