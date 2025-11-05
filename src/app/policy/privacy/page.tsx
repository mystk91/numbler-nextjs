import type { Metadata } from "next";
import PrivacyPolicy from "@/app/components/policy/privacyPolicy/privacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `The privacy policy for Numbler`,
};

export default function Page() {
  return <PrivacyPolicy />
}
