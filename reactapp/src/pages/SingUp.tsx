import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { User, AtSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { registerUser } from "@/services/authService";

export default function SingUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");

const handleToSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser({ username, name, email, password });

      console.log("User registered:", data);
      alert("Account created successfully!");

      localStorage.setItem("authToken", data.token);
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.message || "Network error, try again later");
    }
};

  return (
    <div
      className="border-2 border-[gray] rounded-lg flex items-center justify-center flex-col w-[120%] shadow-lg"
      style={{ padding: "20px", boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)" }}
    >
      <h1 style={{ fontSize: "15px" }}>
        Join{" "}
        <span className="bg-[black] text-[white] p-[5px] rounded-sm ">Ai</span>{" "}
        HBridge
      </h1>
      <p style={{ fontSize: "12px" }}>
        Create your account to get started with AiHBridge
      </p>

      <div className="flex items-start justify-center flex-col text-sm w-full">
        <h2 style={{ fontSize: "15px" }}>Full Name</h2>
        <InputWithIcon
          type="text"
          icon1={
            <User color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          placeholder="Enter your full name"
          bgColor="bg-[#f0f0f0]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex items-start justify-center flex-col text-sm w-full">
        <h2 style={{ fontSize: "15px" }}>username</h2>
        <InputWithIcon
          type="text"
          icon1={
            <AtSign color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          placeholder="Enter your full name"
          bgColor="bg-[#f0f0f0]"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="flex items-start justify-center flex-col w-full ">
        <h2 style={{ fontSize: "15px" }}>Email</h2>
        <InputWithIcon
          type="email"
          icon1={
            <Mail color="gray" size={15} style={{ marginRight: "10px" }} />
          }
          placeholder="Enter your email"
          bgColor="bg-[#f0f0f0]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex items-start justify-center flex-col w-full">
        <h2 style={{ fontSize: "15px" }}>Password</h2>
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
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          bgColor="bg-[#f0f0f0]"
        />
      </div>

      <div className="flex items-start justify-center flex-col w-full">
        <h2 style={{ fontSize: "15px" }}>Confrim Password</h2>
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
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confrim your password"
          className=""
          bgColor="bg-[#f0f0f0]"
        />
      </div>

      <Button className="w-full mt-[30px] " size="lg" onClick={handleToSubmit}>
        Create Account
      </Button>

      <div className="flex flex-row items-center justify-center">
        <p>Already have an account ?</p>
        <span
          className="underline md:decoration-dashed "
          style={{ fontWeight: "bold" }}
        >
          Login
        </span>
      </div>
      
    </div>
  );
}
