"use client";

import dynamic from "next/dynamic";

// Load client-only components with ssr:false.
// This is a "use client" component so next/dynamic ssr:false is allowed here.
const TopNav = dynamic(() => import("./TopNav"), { ssr: false });
const Toaster = dynamic(
  () => import("sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false }
);

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
