"use client";

import { loginUser } from "@/lib/redux/auth/authThunk";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (auth.isUserLoggedIn === true) {
      toast.success("Login Successful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      router.push("/");
    }
  }, [auth.isUserLoggedIn]);

  type loginData = {
    email: string;
    password: string;
  };

  const [loginError, setLoginError] = useState({
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState<loginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const errObj = {
      email: "",
      password: "",
    };

    if (loginForm.email.length === 0) errObj.email = "Enter your Email address";
    else if (
      !loginForm.email.includes("@") ||
      !loginForm.email.endsWith(".com")
    )
      errObj.email = "Please enter a valid email address!!";
    else errObj.email = "";

    if (loginForm.password.length === 0)
      errObj.password = "Please Enter the Password";
    else {
      errObj.password = "";
    }

    const hasErrors = Object.values(errObj).some((error) => error.length > 0);

    setLoginError(errObj);
    if (hasErrors) {
      return;
    }

    //API call
    try {
      const res = await dispatch(
        loginUser({ email: loginForm.email, password: loginForm.password })
      ).unwrap();
    } catch (err) {
      if (err === "Invalid Password") {
        setLoginError((prev) => ({...prev,password: "Invalid Password!",}));
      }else{
        setLoginError((prev) => ({...prev,email: "Invalid Credentials!",}));
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:block w-full">
        <div className="relative flex items-center bg-[#B0CE88] h-[100%] rounded-tr-[25%]">
          <div className="absolute bottom-0 flex justify-center">
            <Image
              className=""
              src="/assets/LoginFormLeftBottom.PNG"
              alt="Project Logo"
              width={650}
              height={380}
            />
          </div>
          <div className="flex-col items-center justify-center h-full w-full">
            <p className="mt-30 text-center pr-10 lg:pr-20 text-[#4C763B] font-bold text-4xl">
              Your Happy Place for Happy Plates.
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
            Your Daily Dose of Delicious.
          </h2>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginForm.email}
                maxLength={40}
                onChange={handleChange}
                className={`w-full ${
                  loginError.email ? "border-red-500" : ""
                } p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B0CE88]`}
              />
              <p className={`absolute top-10 left-2 text-red-500 text-sm`}>
                {loginError.email}
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                maxLength={30}
                onChange={handleChange}
                className={`w-full ${
                  loginError.password ? "border-red-500" : ""
                } p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#B0CE88]`}
              />
              <p className={`absolute top-10 left-2 text-red-500 text-sm`}>
                {loginError.password}
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#043915] text-white py-2 rounded-md cursor-pointer transition-all"
            >
              Sign In
            </button>
          </div>
          <p className="text-center font-[500] mt-3 ">
            Don't have an account?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              {" "}
              Proceed to Sign up{" "}
            </span>
          </p>
          <div className="flex justify-center">
            <Image
              className=""
              src="/assets/LoginRightImage.PNG"
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
