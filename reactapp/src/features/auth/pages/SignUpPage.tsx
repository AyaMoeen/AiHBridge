import SignUp from "@/features/auth/forms/SingUp";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh w-full items-center  justify-center p-6 md:p-10">
      <div className="w-full max-w-lg ">
        <SignUp />
      </div>
    </div>
  );
}
