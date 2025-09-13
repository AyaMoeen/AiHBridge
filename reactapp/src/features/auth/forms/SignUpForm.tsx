// src/features/auth/forms/SignUpForm.tsx
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
import { GalleryVerticalEnd, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate()
    const { register, error, isLoading, clearError } = useAuth()

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [formErrors, setFormErrors] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    })

    const validateForm = () => {
        const errors = {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
        let isValid = true

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required'
            isValid = false
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters'
            isValid = false
        }

        // Username validation
        if (!formData.username.trim()) {
            errors.username = 'Username is required'
            isValid = false
        } else if (formData.username.trim().length < 3) {
            errors.username = 'Username must be at least 3 characters'
            isValid = false
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = 'Username can only contain letters, numbers, and underscores'
            isValid = false
        }

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
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters'
            isValid = false
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password'
            isValid = false
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
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
            await register(formData.name, formData.email, formData.password, formData.username)
            // Redirect to home page on successful registration
            navigate('/')
        } catch (err) {
            // Error is handled by the AuthContext
            console.error('Registration failed:', err)
        }
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
                        Create your account to get started
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
                        <div className="flex flex-col gap-4">
                            {/* Name Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className={cn(
                                        "border-gray-200",
                                        formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                                    )}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-red-600">{formErrors.name}</p>
                                )}
                            </div>

                            {/* Username Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="johndoe123"
                                    className={cn(
                                        "border-gray-200",
                                        formErrors.username ? "border-red-500 focus-visible:ring-red-500" : ""
                                    )}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                                {formErrors.username && (
                                    <p className="text-sm text-red-600">{formErrors.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
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

                            {/* Password Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword.password ? "text" : "password"}
                                        className={cn(
                                            "border-gray-200 pr-10",
                                            formErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                                        )}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                           
                                </div>
                                {formErrors.password && (
                                    <p className="text-sm text-red-600">{formErrors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        className={cn(
                                            "border-gray-200 pr-10",
                                            formErrors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
                                        )}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                              
                                </div>
                                {formErrors.confirmPassword && (
                                    <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col gap-3 mt-2">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                                disabled={isLoading}
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