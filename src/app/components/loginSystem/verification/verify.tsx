import VerificationMessage from "@/app/components/loginSystem/verification/verificationMessage";

interface Props {
  code: string;
}

// Tries to verify the users email and create an account
export default async function Verify({ code }: Props) {
  let success = false;
  try {
    const options = {
      method: "POST",
      body: JSON.stringify({ code: code }),
      headers: { "Content-Type": "application/json" },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/verifyEmail`,
      options
    );
    const data = await res.json();
    if (data.success) {
      success = true;
    }
  } catch {}

  return <VerificationMessage success={success} />;
}
