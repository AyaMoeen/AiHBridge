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
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import { Mail, Loader2, CheckCircle, GalleryVerticalEnd } from "lucide-react"

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            setError("Please enter your email address")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            await authService.requestPasswordReset(email)
            setIsSuccess(true)
            // Navigate to verification page after 2 seconds
            setTimeout(() => {
                navigate("/verify-code", { state: { email } })
            }, 2000)
        } catch (error: unknown) {
            setError((error as Error).message || "Failed to send verification code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center gap-2">
                            <GalleryVerticalEnd className="size-6" />
                            <CardTitle className="text-center text-xl">AIHBridge</CardTitle>
                        </div>
                        <CardDescription>
                            Check your email for verification code
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg mb-2">Verification Code Sent!</h3>
                                <p className="text-muted-foreground text-sm">
                                    We've sent a verification code to <strong>{email}</strong>
                                </p>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Redirecting to verification page...
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-center gap-2">
                        <GalleryVerticalEnd className="size-6" />
                        <CardTitle className="text-center text-xl">AIHBridge</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your email address to receive a verification code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2/6 align-items-center transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 border-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Code...
                                        </>
                                    ) : (
                                        "Send Verification Code"
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Remember your password?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
