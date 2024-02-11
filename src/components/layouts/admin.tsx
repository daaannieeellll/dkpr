import {
  HomeIcon,
  Bars3BottomLeftIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const items = [
  { Icon: AdjustmentsHorizontalIcon, href: "/admin/slugs" },
  // { Icon: Bars3BottomLeftIcon, href: "/admin/quotes" },
  { Icon: HomeIcon, href: "/admin" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState(() => {
    const index = items.findIndex(({ href }) => href === router.pathname);
    return index === -1 ? 0 : index;
  });
  const transform = useMemo(
    () => `translateX(${-47 + (94 / (items.length + 1)) * (1 + selected)}vw)`,
    [selected]
  );

  return (
    <>
      <nav className="fixed inset-x-8 bottom-6 flex h-16 w-[calc(100vw-4rem)] items-center justify-evenly overflow-hidden rounded-2xl border-2 border-teal-800/30 bg-[#0F0F0F] shadow-2xl shadow-black/50">
        <div className="absolute -top-32 left-0 h-40 w-[calc(100vw-6rem)] bg-[#2f3f38] blur-2xl" />
        <div
          className="absolute -bottom-20 h-20 w-20 bg-teal-600 blur-xl transition-transform duration-500 ease-in-out will-change-transform"
          style={{
            transform,
            WebkitTransform: transform,
            msTransform: transform,
          }}
        />
        {items.map(({ Icon, href }, index) => (
          <Link
            key={index}
            className="z-10 h-6 w-6"
            onClick={() => setSelected(index)}
            href={href}
          >
            <Icon
              className={`transition-colors duration-500 ${
                selected === index ? "text-teal-400" : "text-white/40"
              }`}
            />
          </Link>
        ))}
      </nav>

      <main className="px-5">{children}</main>
    </>
  );
};

export default AdminLayout;
