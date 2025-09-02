import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { GalleryVerticalEnd } from "lucide-react"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()

    return (
        <div className={cn("flex flex-col gap-6 ", className)} {...props}>
            <Card className="border-black">
                <CardHeader>
                    <div className="flex items-center justify-center gap-2">
                        <GalleryVerticalEnd className="size-6" />
                        <CardTitle className="text-white text-center text-xl">AIHBridge</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/forgot-password")}
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="signup" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}