// src/features/auth/forms/LoginForm.tsx
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
import { GalleryVerticalEnd, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const { login, error, isLoading, clearError } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: ''
    })

    const validateForm = () => {
        const errors = { email: '', password: '' }
        let isValid = true

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address'
            isValid = false
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required'
            isValid = false
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }

        // Clear auth error when user starts typing
        if (error) {
            clearError()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await login(formData.email, formData.password)
            // Redirect to home page on successful login
            navigate('/')
        } catch (err) {
            // Error is handled by the AuthContext
            console.error('Login failed:', err)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="">
                <CardHeader>
                    <div className="flex items-center justify-center gap-2">
                        <GalleryVerticalEnd className="size-6" />
                        <CardTitle className="text-center text-xl">AIHBridge</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Auth Error Display */}
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
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    className={cn(
                                        "border-gray-200",
                                        formErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                                    )}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                                {formErrors.email && (
                                    <p className="text-sm text-red-600">{formErrors.email}</p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/forgot-password")}
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600"
                                        disabled={isLoading}
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={cn(
                                        "border-gray-200",
                                        formErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                                    )}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                                {formErrors.password && (
                                    <p className="text-sm text-red-600">{formErrors.password}</p>
                                )}
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
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                                disabled={isLoading}
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}