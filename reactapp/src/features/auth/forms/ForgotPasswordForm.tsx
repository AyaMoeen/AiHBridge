// src/features/auth/forms/ForgotPasswordForm.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { GalleryVerticalEnd, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { useState } from "react"
import { authService } from "../services/authService"

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await authService.requestPasswordReset(email)
            setSuccess(true)
            // Navigate to verification page after 2 seconds
            setTimeout(() => {
                navigate('/verify-code', { state: { email } })
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="size-6 text-green-500" />
                            <CardTitle className="text-center text-xl">Check Your Email</CardTitle>
                        </div>
                        <CardDescription className="text-center">
                            We've sent a verification code to {email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 text-center">
                            Redirecting to verification page...
                        </p>
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
                        <CardTitle className="text-center text-xl">Forgot Password</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your email address and we'll send you a verification code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    className="border-gray-200"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Verification Code'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Remember your password?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                                disabled={isLoading}
                            >
                                Back to login
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
