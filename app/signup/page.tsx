"use client";

import LoadingSpinner from "@/components/loader/Spinner";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  type signupData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const router = useRouter()

  const [signupError, setSignupError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signupForm, setSignupForm] = useState<signupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading,setIsLoading] = useState(false)
  const handleSubmit = async () => {
    const errObj = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (signupForm.name.length === 0) errObj.name = "Enter the Name";
    else errObj.name = "";

    if (signupForm.email.length === 0)
      errObj.email = "Enter your Email address";
    else if (
      !signupForm.email.includes("@") ||
      !signupForm.email.endsWith(".com")
    )
      errObj.email = "Please enter a valid email address!!";
    else errObj.email = "";

    if (signupForm.password.length === 0)
      errObj.password = "Please Enter the Password";
    else if (signupForm.password.length < 8)
      errObj.password = "Password must be at least 8 characters long";
    else if (signupForm.password !== signupForm.confirmPassword)
      errObj.confirmPassword = "Passwords do not match";
    else {
      errObj.confirmPassword = "";
      errObj.password = "";
    }

    if (signupForm.confirmPassword.length === 0)
      errObj.confirmPassword = "Please Re Enter the Password";

    const hasErrors = Object.values(errObj).some((error) => error.length > 0);

    setSignupError(errObj);
    if (hasErrors) {
      return;
    }

    //API call
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      router.push("/login")
    } catch (err:any) {
      console.log(err)
      toast.error(err.response.data.error)
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:block w-full">
        <div className="relative flex items-center bg-[#FFFD8F] h-[100%] rounded-tr-[25%] ">
          <div className="absolute bottom-1/5 flex justify-center">
            <Image
              className=""
              src="/assets/signupmiddlesandwitch.PNG"
              alt="Project Logo"
              width={500}
              height={180}
            />
          </div>
          <div className="flex-col items-center justify-center h-full w-full">
            <p className="mt-30 text-center pr-10 lg:pr-20 text-[#4C763B] font-bold text-4xl">
              Where Cravings Become Comfort.
            </p>
            <p className="mt-10 text-center pr-10 lg:pr-20 text-[#043915] font-bold text-7xl font-['Fantasy']">
              Let's EatO.
            </p>
          </div>
        </div>
      </div>

      <div className=" h-full w-full flex justify-center">
        <div className="relative rounded-2xl p-8 pb-0 w-full max-w-lg">
          <h1 className="pt-5 md:pt-10 text-center text-[#043915] font-bold text-6xl font-['Fantasy']">
            EatO
          </h1>
          <h2 className="text-xl font-bold mb-6 text-center">
            Sign Up and Get upto 50% Off on your First Order
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={signupForm.name}
                maxLength={30}
                onChange={handleChange}
                className={`w-full ${
                  signupError.name ? "border-red-500" : ""
                } p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B0CE88]`}
              />
              <p className={`absolute top-10 left-2 text-red-500 text-sm`}>
                {signupError.name}
              </p>
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={signupForm.email}
                maxLength={40}
                onChange={handleChange}
                className={`w-full ${
                  signupError.email ? "border-red-500" : ""
                } p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B0CE88]`}
              />
              <p className={`absolute top-10 left-2 text-red-500 text-sm`}>
                {signupError.email}
              </p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={signupForm.password}
                maxLength={30}
                onChange={handleChange}
                className={`w-full ${
                  signupError.password ? "border-red-500" : ""
                } p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B0CE88]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute button cursor-pointer right-3 top-2.5 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <p className={`absolute top-10 left-2 text-red-500 text-sm`}>
                {signupError.password}
              </p>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signupForm.confirmPassword}
                onChange={handleChange}
                maxLength={30}
                className={`w-full ${
                  signupError.confirmPassword ? "border-red-500" : ""
                } p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B0CE88]`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute button cursor-pointer right-3 top-2.5 text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <p className={`absolute top-10 left-2 text-red-500 text-sm`}>
                {signupError.confirmPassword}
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex justify-center bg-[#043915] text-white py-2 rounded-md cursor-pointer transition-all">
              {isLoading ? <span className="flex items-center gap-2"><LoadingSpinner size={20}/><p>Signing Up...</p> </span> : "Sign Up"}
            </button>
          </div>
          <p className="text-center font-[500] mt-3 ">
            Already have an account?{" "}
            <span onClick={()=>router.push("/login")} className="text-blue-500 cursor-pointer hover:underline">
              {" "}
              Proceed to Signin{" "}
            </span>
          </p>
          <div className="flex justify-center">
            <Image
              className=""
              src="/assets/signupBottomImage.PNG"
              alt="Project Logo"
              width={300} // Always include width and height
              height={180}
            />
          </div>
        </div>
      </div>
    </div>
  );
}