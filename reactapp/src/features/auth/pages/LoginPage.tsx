import { LoginForm } from "../forms/LoginForm"

export default function LoginPage() {
    return (
        <div className="flex min-h-svh w-full items-center  bg-black justify-center p-6 md:p-10">
            <div className="w-full max-w-sm ">
                <LoginForm />
            </div>
        </div>
    )
}
