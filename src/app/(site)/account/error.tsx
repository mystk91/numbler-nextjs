"use client";
import ExpectedError from "@/app/components/errors/Expected Error/error";
export default function Error() {
  return <ExpectedError reset={() => window.location.reload()} />;
}
