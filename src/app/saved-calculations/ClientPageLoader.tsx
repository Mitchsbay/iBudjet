"use client";

import dynamic from "next/dynamic";

const ClientPage = dynamic(() => import("./ClientPage"), {
  ssr: false,
  loading: () => null,
});

export default function ClientPageLoader() {
  return <ClientPage />;
}
