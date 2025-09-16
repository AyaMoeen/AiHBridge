import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  GalleryVerticalEnd,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.name = "Full name is required";
    } else if (trimmedName.length < 2 || trimmedName.length > 50) {
      errors.name = "Name must be between 2 and 50 characters";
    }
    if (!trimmedUsername) {
      errors.username = "Username is required";
    } else if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      errors.username = "Username must be between 3 and 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      errors.username =
        "Username can only contain letters, numbers, and underscores";
    }
    if (!trimmedEmail) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Invalid email format";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6 || password.length > 20) {
      errors.password = "Password must be between 6 and 20 characters";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleToSubmit = async () => {
    if (!validateForm()) return;
    try {
      await register(name, email, password, username);
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="bg-secondary-foreground border-2 border-gray-300 rounded-lg flex items-center justify-center flex-col w-full shadow-lg p-6 ">
      <div className="flex flex-row gap-3">
        <GalleryVerticalEnd className="size-6" />
        <h1 className="text-lg font-bold">AIHBridge</h1>
      </div>
      <p className="mt-2 text-[12px]">
        Create your account to get started with AiHBridge
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 w-full">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex flex-col w-full gap-2 mt-3 mb-2">
        <h2 className="text-sm">Full Name</h2>
        <InputWithIcon
          type="text"
          icon1={
            <User color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          placeholder="Enter your full name"
          bgColor="bg-muted"
          value={name}
          onChange={(e) => {
            if (error) clearError();
            setName(e.target.value);
          }}
        />
        {formErrors.name && (
          <p className="text-xs text-red-500">{formErrors.name}</p>
        )}
      </div>

      <div className="flex flex-col w-full gap-2 mt-3 mb-2">
        <h2 className="text-sm">Username</h2>
        <InputWithIcon
          type="text"
          icon1={
            <AtSign color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          placeholder="Choose a username"
          bgColor="bg-muted"
          value={username}
          onChange={(e) => {
            if (error) clearError();
            setUserName(e.target.value);
          }}
        />
        {formErrors.username && (
          <p className="text-xs text-red-500">{formErrors.username}</p>
        )}
      </div>

      <div className="flex flex-col w-full gap-2 mt-3 mb-2">
        <h2 className="text-sm">Email</h2>
        <InputWithIcon
          type="email"
          icon1={
            <Mail color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          placeholder="Enter your email"
          bgColor="bg-muted"
          value={email}
          onChange={(e) => {
            if (error) clearError();
            setEmail(e.target.value);
          }}
        />
        {formErrors.email && (
          <p className="text-xs text-red-500">{formErrors.email}</p>
        )}
      </div>

      <div className="flex flex-col w-full gap-2 mt-3 mb-2">
        <h2 className="text-sm">Password</h2>
        <InputWithIcon
          type={passwordVisible ? "text" : "password"}
          icon1={
            <Lock color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          icon2={
            passwordVisible ? (
              <EyeOff
                color="gray"
                size={15}
                className="cursor-pointer"
                onClick={() => setPasswordVisible(false)}
              />
            ) : (
              <Eye
                color="gray"
                size={15}
                className="cursor-pointer"
                onClick={() => setPasswordVisible(true)}
              />
            )
          }
          value={password}
          onChange={(e) => {
            if (error) clearError();
            setPassword(e.target.value);
          }}
          placeholder="Create a password"
          bgColor="bg-muted"
        />
        {formErrors.password && (
          <p className="text-xs text-red-500">{formErrors.password}</p>
        )}
      </div>

      <div className="flex flex-col w-full gap-2 mt-3 b-2">
        <h2 className="text-sm">Confirm Password</h2>
        <InputWithIcon
          type={passwordVisibleConfirm ? "text" : "password"}
          icon1={
            <Lock color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          icon2={
            passwordVisibleConfirm ? (
              <EyeOff
                color="gray"
                size={15}
                className="cursor-pointer"
                onClick={() => setPasswordVisibleConfirm(false)}
              />
            ) : (
              <Eye
                color="gray"
                size={15}
                className="cursor-pointer"
                onClick={() => setPasswordVisibleConfirm(true)}
              />
            )
          }
          value={confirmPassword}
          onChange={(e) => {
            if (error) clearError();
            setConfirmPassword(e.target.value);
          }}
          placeholder="Confirm your password"
          bgColor="bg-muted"
        />
        {formErrors.confirmPassword && (
          <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>
        )}
      </div>

      <Button
        className="w-full mt-6 bg-primary rounded cursor-pointer"
        size="lg"
        onClick={handleToSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="flex flex-row items-center justify-center mt-4 gap-1 text-sm">
        <p>Already have an account?</p>
        <button
          onClick={() => navigate("/login")}
          className="underline underline-offset-4 font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
          disabled={isLoading}
        >
          Login
        </button>
      </div>
    </div>
  );
}
