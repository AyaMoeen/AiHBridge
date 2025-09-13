
// src/features/auth/forms/VerificationForm.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate, useLocation } from "react-router-dom"
import { GalleryVerticalEnd, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { authService } from "../services/authService"

export function VerificationForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''

    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password')
        }
    }, [email, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await authService.verifyResetCode(code)
            // Navigate to reset password page with the reset token
            navigate('/reset-password', {
                state: {
                    email,
                    resetToken: result.reset_token
                }
            })
        } catch (err: any) {
            setError(err.message || 'Invalid verification code')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        setError('')
        setIsLoading(true)

        try {
            await authService.requestPasswordReset(email)
            alert('New verification code sent!')
        } catch (err: any) {
            setError(err.message || 'Failed to resend code')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-center gap-2">
                        <GalleryVerticalEnd className="size-6" />
                        <CardTitle className="text-center text-xl">Enter Verification Code</CardTitle>
                    </div>
                    <CardDescription>
                        We sent a 6-digit code to {email}
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
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="000000"
                                    className="border-gray-200 text-center text-lg tracking-widest"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    disabled={isLoading}
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Enter the 6-digit code from your email
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || code.length !== 6}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm space-y-2">
                            <p>
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                                    disabled={isLoading}
                                >
                                    Resend code
                                </button>
                            </p>
                            <p>
                                <button
                                    type="button"
                                    onClick={() => navigate("/reset-password")}
                                    className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                                    disabled={isLoading}
                                >
                                    Back to login
                                </button>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

