const Navbar = () => {
  const { data: session } = useSession();
  return (
    <nav className="fixed flex h-11 w-full flex-row items-center justify-center text-white">
      <div className="flex h-full w-full max-w-6xl flex-row items-center justify-between pl-5 pr-5 ">
        <div>
          <Link href="/" className="font-code text-xl font-bold">
            dkpr
          </Link>
        </div>
        <div className="">
          {session ? (
            <Link
              href="/api/auth/signout"
              className="rounded-full bg-gradient-to-r from-teal-900 to-sky-700 pr-4 pl-4 pt-2 pb-2"
            >
              Log out
            </Link>
          ) : (
            <Link
              href="/api/auth/signin"
              className="rounded-full bg-gradient-to-r from-teal-900 to-sky-700 pr-4 pl-4 pt-2 pb-2"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
