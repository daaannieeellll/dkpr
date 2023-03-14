import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useMemo } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navLinks = useMemo(
    () => [
      { href: "/admin", text: "Dashboard" },
      { href: "/admin/slugs", text: "Slugs" },
      { href: "/admin/quotes", text: "Quotes" },
    ],
    []
  );

  return (
    <div>
      <nav className="flex h-11 w-full flex-row justify-center font-code text-white">
        <div className="mx-5 flex h-full w-full max-w-6xl flex-row items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            dkpr
          </Link>
          <div className="">
            <Popover>
              {({ close }) => (
                <>
                  <Popover.Button
                    as={Hamburger}
                    className="align-center flex"
                  />
                  <Transition
                    as={Fragment}
                    enterFrom="opacity-0 translate-y-5"
                    enterTo="opacity-100 translate-y-0"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-5"
                  >
                    <Popover.Panel
                      as="ul"
                      className="absolute left-0 top-11 mr-3 flex h-[calc(100vh-2.75rem)] w-full flex-col items-center px-10 py-5 backdrop-blur transition-all duration-300"
                    >
                      {navLinks.map((link, idx) => (
                        <li key={idx} className="py-10" onClick={close}>
                          <Link href={link.href}>{link.text}</Link>
                        </li>
                      ))}
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      </nav>

      <main className="px-5">{children}</main>
    </div>
  );
};

interface HamburgerProps {
  className?: string;
  onClick?: () => void;
}
const Hamburger = ({ className, onClick }: HamburgerProps) => (
  <div
    className={`relative ${className ?? ""}`}
    onClick={onClick ?? (() => undefined)}
  >
    <div className="relative flex h-[50px] w-[50px] transform items-center justify-center overflow-hidden transition-all duration-200">
      <div className="flex h-[20px] w-[20px] origin-center transform flex-col justify-between overflow-hidden transition-all duration-300">
        <div className="h-[2px] w-7 origin-left transform bg-white transition-all duration-300 ui-open:translate-x-10" />
        <div className="h-[2px] w-7 transform rounded bg-white transition-all delay-75 duration-300 ui-open:translate-x-10" />
        <div className="h-[2px] w-7 origin-left transform bg-white transition-all delay-150 duration-300 ui-open:translate-x-10" />
        <div className="absolute top-2.5 flex w-0 -translate-x-10 transform items-center justify-between transition-all duration-500 ui-open:w-12 ui-open:translate-x-0">
          <div className="absolute h-[2px] w-5 rotate-0 transform bg-white transition-all delay-300 duration-500 ui-open:rotate-45" />
          <div className="absolute h-[2px] w-5 -rotate-0 transform bg-white transition-all delay-300 duration-500 ui-open:-rotate-45" />
        </div>
      </div>
    </div>
  </div>
);

export default AdminLayout;
