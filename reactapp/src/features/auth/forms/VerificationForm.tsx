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
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from "../services/authService"
import { Shield, Loader2, CheckCircle, Clock, GalleryVerticalEnd } from "lucide-react"

export function VerificationForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ""

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!code || code.length !== 6) {
            setError("Please enter a valid 6-digit verification code")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            await authService.verifyResetCode(email, code)
            setIsSuccess(true)
            // Navigate to reset password page after 2 seconds
            setTimeout(() => {
                navigate("/reset-password", { state: { email, code } })
            }, 2000)
        } catch (error: unknown) {
            setError((error as Error).message || "Invalid verification code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        setIsLoading(true)
        setError("")

        try {
            await authService.requestPasswordReset(email)
            setTimeLeft(300)
            setCanResend(false)
            setError("")
        } catch (error: unknown) {
            setError((error as Error).message || "Failed to resend code. Please try again.")
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
                            Code verified successfully
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg mb-2">Code Verified!</h3>
                                <p className="text-muted-foreground text-sm">
                                    Redirecting to reset password page...
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
                        Enter the 6-digit verification code sent to your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="code">Verification Code</Label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="pl-10 text-center text-lg tracking-widest border-gray-400"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Timer */}
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Code expires in: {formatTime(timeLeft)}</span>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </Button>

                                {canResend && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleResendCode}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Resending...
                                            </>
                                        ) : (
                                            "Resend Code"
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                ← Back to email
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
