import type { Metadata } from "next";
import ToS from "@/app/components/policy/tos/tos";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms of service for Numbler`,
};

export default function Page() {
  return <ToS />;
}
