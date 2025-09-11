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
import { Lock, Eye, EyeOff, Loader2, CheckCircle, Check, X, GalleryVerticalEnd } from "lucide-react"
import { validatePassword, getPasswordRequirements, getPasswordStrengthLabel, getPasswordStrengthColor } from "@/utils/passwordValidation"

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const location = useLocation()
    const { email, code } = location.state || {}

    const passwordStrength = validatePassword(newPassword)
    const passwordRequirements = getPasswordRequirements(newPassword)
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0
    const isFormValid = passwordStrength.isValid && passwordsMatch

    // Redirect if no email/code
    useEffect(() => {
        if (!email || !code) {
            navigate("/forgot-password")
        }
    }, [email, code, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid) {
            setError("Please ensure all requirements are met and passwords match")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            await authService.resetPassword(email, code, newPassword)
            setIsSuccess(true)
            // Navigate to login page after 3 seconds
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (error: unknown) {
            setError((error as Error).message || "Failed to reset password. Please try again.")
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
                            Password reset successfully
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg mb-2">Password Reset!</h3>
                                <p className="text-muted-foreground text-sm">
                                    Your password has been successfully reset.
                                </p>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Redirecting to login page...
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
                    <CardTitle className="text-center text-xl" >Reset New Password</CardTitle>
                    <CardDescription>
                        Create a strong password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            {/* New Password */}
                            <div className="grid gap-3">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10 pr-10 border-gray-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {newPassword && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Password strength:</span>
                                            <span className={`font-medium ${passwordStrength.score <= 1 ? 'text-red-600' :
                                                passwordStrength.score === 2 ? 'text-orange-600' :
                                                    passwordStrength.score === 3 ? 'text-yellow-600' :
                                                        'text-green-600'
                                                }`}>
                                                {getPasswordStrengthLabel(passwordStrength.score)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                data-width={passwordStrength.score}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password Requirements */}
                                {newPassword && (
                                    <div className="space-y-1">
                                        {passwordRequirements.map((requirement, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                {requirement.met ? (
                                                    <Check className="h-3 w-3 text-green-600" />
                                                ) : (
                                                    <X className="h-3 w-3 text-muted-foreground" />
                                                )}
                                                <span className={requirement.met ? "text-green-600" : "text-muted-foreground"}>
                                                    {requirement.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {confirmPassword && (
                                    <div className="flex items-center gap-2 text-sm">
                                        {passwordsMatch ? (
                                            <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <X className="h-3 w-3 text-red-600" />
                                        )}
                                        <span className={passwordsMatch ? "text-green-600" : "text-red-600"}>
                                            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !isFormValid}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <button
                                type="button"
                                onClick={() => navigate("/verify-code", { state: { email, code } })}
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                ← Back to verification
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
