import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>dkpr</title>
        <meta name="theme-color" content="#000000" />
      </Head>

      <nav className="fixed flex h-11 w-full flex-row justify-center font-code text-white">
        <div className="mx-5 flex h-full w-full max-w-6xl flex-row items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            dkpr
          </Link>
          <div className="">
            <button
              className="rounded-full bg-gradient-to-tr from-teal-700/30 to-sky-300/40 pr-4 pl-4 pt-2 pb-2 shadow-lg shadow-teal-900/20 backdrop-blur-md backdrop-filter hover:shadow-teal-900/40"
              onClick={session ? () => void signOut() : () => void signIn()}
            >
              {session ? `Log out` : `Log in`}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center justify-center bg-hero from-black via-black/75 bg-cover bg-center">
        <div className="container flex flex-col items-center justify-center gap-40 px-4 py-8">
          <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-8 border-r-white pr-2 font-code text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            dkpr
          </h1>
          <div>
            <Link
              className="inline-block rounded-full bg-gradient-to-tr from-teal-700/30 to-sky-300/40 px-10 py-5 font-code text-lg font-semibold text-white shadow-lg shadow-teal-900/20 backdrop-blur-sm backdrop-filter hover:from-teal-700/30 hover:to-sky-300/70 hover:shadow-teal-900/40 active:from-teal-700/5 active:to-sky-300/50"
              href="/admin"
              // target="_blank"
            >
              Get started →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
