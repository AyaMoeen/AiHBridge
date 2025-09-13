// src/features/auth/forms/ResetPasswordForm.tsx
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate, useLocation } from "react-router-dom"
import { GalleryVerticalEnd, AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { authService } from "../services/authService"

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''
    const resetToken = location.state?.resetToken || ''

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!email || !resetToken) {
            navigate('/forgot-password')
        }
    }, [email, resetToken, navigate])

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long'
        }
        return ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate passwords
        const passwordError = validatePassword(formData.newPassword)
        if (passwordError) {
            setError(passwordError)
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            await authService.resetPassword(
                formData.newPassword,
                formData.confirmPassword,
                resetToken
            )
            setSuccess(true)
            // Navigate to login page after 3 seconds
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Failed to reset password')
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
                            <CardTitle className="text-center text-xl">Password Reset Successfully</CardTitle>
                        </div>
                        <CardDescription className="text-center">
                            Your password has been updated successfully
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 text-center">
                            Redirecting to login page...
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
                        <CardTitle className="text-center text-xl">Reset Password</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your new password for {email}
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
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword.newPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className="border-gray-200 pr-10"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            newPassword: e.target.value
                                        }))}
                                        disabled={isLoading}
                                        required
                                    />
                                
                                </div>
                                <p className="text-xs text-gray-500">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className="border-gray-200 pr-10"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                        disabled={isLoading}
                                        required
                                    />
                             
                                </div>
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
                                            Resetting Password...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm">
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