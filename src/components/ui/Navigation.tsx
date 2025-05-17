"use client";
import Container from "@/components/layout/Container";
import Image from "next/image";
import logoImage from "../../../public/logo.png";
import { Button } from "@/components/ui/button";
import Model from "@/components/ui/Model";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { LoginCompany, LoginJobSeeker } from "@/utils/ApisFunctions/JobsApi";
import {
  AuthCompanyResponse,
  AuthJobSeekerResponse,
  Login as LoginType,
} from "@/utils/types";
import toast from "react-hot-toast";
import { useGetUser } from "@/hooks/useGetUser";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { user: userLocal } = useGetUser();
  const [user, setUser] = useState<
    AuthJobSeekerResponse | AuthCompanyResponse | null
  >(userLocal);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is logged in on component mount and when user changes
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      // Close modal if it's open
      setOpen(false);
    } else {
      setIsLoggedIn(false);
    }
  }, [user, isLoggedIn, userLocal]);

  const userAuth = user || userLocal;

  return (
    <nav className="bg-blue-900 p-2">
      <Container styleElement="flex flex-row items-center justify-between">
        <Link
          href={"/"}
          className="flex items-center gap-2 hover:cursor-pointer"
        >
          <Image
            className="w-10 h-10 md:w-12 md:h-12"
            src={logoImage}
            alt="logo"
          />
          <p className="text-white font-bold text-xl md:text-2xl">JOBBIT</p>
        </Link>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:block">
          {userAuth ? (
            userAuth.role === "JobSeeker" ? (
              <PermissionUser setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <PermissionCompany setIsLoggedIn={setIsLoggedIn} />
            )
          ) : (
            <OAuth setOpen={setOpen} />
          )}
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 mt-2 rounded-md p-4 transition-all duration-300">
          {userAuth ? (
            userAuth.role === "JobSeeker" ? (
              <MobileMenuUser
                setIsLoggedIn={setIsLoggedIn}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            ) : (
              <MobileMenuCompany
                setIsLoggedIn={setIsLoggedIn}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            )
          ) : (
            <MobileOAuth
              setOpen={setOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          )}
        </div>
      )}

      {!isLoggedIn && (
        <Model isOpen={open} onClose={setOpen}>
          <Login
            setUser={setUser}
            onClose={setOpen}
            setIsLoggedIn={setIsLoggedIn}
          />
        </Model>
      )}
    </nav>
  );
}

function MobileMenuUser({
  setIsLoggedIn,
  setMobileMenuOpen,
  setUser,
}: {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<
    SetStateAction<AuthCompanyResponse | AuthJobSeekerResponse | null>
  >;
}) {
  const menuItems = [
    { label: "Personal information", href: "/profile" },
    { label: "Documents", href: "/profile/documents" },
    { label: "Technologies & notifications", href: "/profile/technologies" },
    { label: "Your applications", href: "/profile/candidatures" },
    { label: "Security", href: "/profile/securite" },
    { label: "Resume generator", href: "/profile/generator" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={"/profile"}
        className="bg-blue-700 text-sm text-white font-normal hover:bg-blue-600 w-full justify-center"
      >
        manage your portfolio
      </Link>
      <div className="flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <div className="border-t border-blue-700 my-2"></div>
        <Link
          onClick={() => {
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setMobileMenuOpen(false);
            setUser(null);
          }}
          href="/"
          className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
        >
          Log out
        </Link>
      </div>
    </div>
  );
}

function MobileMenuCompany({
  setIsLoggedIn,
  setMobileMenuOpen,
  setUser,
}: {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<
    SetStateAction<AuthCompanyResponse | AuthJobSeekerResponse | null>
  >;
}) {
  const menuItems = [
    { label: "MANGE JOB OFFERS", href: "/company" },
    { label: "ENTERPRISE INFORMATION", href: "/company/info" },
    { label: "SECURITY", href: "/company/securite" },
  ];

  return (
    <div className="flex flex-col gap-2">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          {item.label}
        </Link>
      ))}
      <div className="border-t border-blue-700 my-2"></div>
      <Link
        onClick={() => {
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setMobileMenuOpen(false);
          setUser(null);
        }}
        href="/"
        className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
      >
        Log out
      </Link>
    </div>
  );
}

function MobileOAuth({
  setOpen,
  setMobileMenuOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigation = useRouter();

  function handleOnClickLogin() {
    setOpen(true);
    setMobileMenuOpen(false);
  }

  function handleOnClickRegister() {
    navigation.push("/auth/");
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleOnClickLogin}
        className="bg-blue-700 border border-gray-400 py-2 px-4 text-white font-medium text-base hover:bg-blue-600 w-full"
      >
        Login
      </Button>
      <Button
        onClick={handleOnClickRegister}
        className="bg-white py-2 px-4 text-blue-950 font-medium text-base hover:bg-gray-100 w-full"
      >
        Register
      </Button>
    </div>
  );
}

type FormValues = {
  role: "User" | "Company";
  email: string;
  password: string;
  remember: boolean;
};

export function Login({
  onClose,
  setIsLoggedIn,
  setUser,
}: {
  onClose: Dispatch<SetStateAction<boolean>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<
    SetStateAction<AuthJobSeekerResponse | AuthCompanyResponse | null>
  >;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { role: "User", remember: false },
  });

  const { mutate: LoginJobSekerMutation, isPending } = useMutation({
    mutationFn: (data: LoginType) => LoginJobSeeker(data),
    onSuccess: (userJobSeeker) => {
      localStorage.setItem("user", JSON.stringify(userJobSeeker));
      setUser(userJobSeeker);
      setIsLoggedIn(true);
      onClose(false);
      toast.success("Login successfully!");
      window.dispatchEvent(new Event("local-storage-change"));
      window.dispatchEvent(new Event("storage"));
      document.body.style.overflow = "";
    },
    onError() {
      toast.error("Invalid email or password");
    },
  });

  const { mutate: LoginCompanyMutation, isPending: isLoginCompany } =
    useMutation({
      mutationFn: (data: LoginType) => LoginCompany(data),
      onSuccess: (userCompany) => {
        localStorage.setItem("user", JSON.stringify(userCompany));
        setUser(userCompany);
        setIsLoggedIn(true);
        onClose(false);
        toast.success("Login successfully!");
        window.dispatchEvent(new Event("local-storage-change"));
        window.dispatchEvent(new Event("storage"));
        document.body.style.overflow = "";
      },
      onError() {
        toast.error("Invalid email or password");
      },
    });

  const onSubmit = (data: FormValues) => {
    if (data.role === "User") {
      const { email, password } = data;
      LoginJobSekerMutation({ email, password });
    } else {
      const { email, password } = data;
      LoginCompanyMutation({ email, password });
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-md w-full mx-auto">
      <form
        className="flex flex-col gap-5 md:gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-center mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Sign in to your account
          </p>
        </div>

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-2 font-medium">
                ACCOUNT TYPE
              </p>
              <RadioGroup
                className="flex justify-center items-center gap-8 md:gap-12"
                value={field.value}
                onValueChange={field.onChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="User"
                    id="role-user"
                    className="text-blue-600"
                  />
                  <Label htmlFor="role-user" className="font-medium">
                    Job Seeker
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Company"
                    id="role-company"
                    className="text-blue-600"
                  />
                  <Label htmlFor="role-company" className="font-medium">
                    Company
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        />

        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-200"
                }`}
                placeholder="name@example.com"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
            </div>
            <div className="relative">
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-200"
                }`}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register("remember")}
            />
            <span className="text-gray-600 text-sm">Remember me</span>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ease-in-out transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={isPending || isLoginCompany}
        >
          {isPending || isLoginCompany ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/auth"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

function PermissionUser({
  setIsLoggedIn,
  setUser,
}: {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<
    SetStateAction<AuthCompanyResponse | AuthJobSeekerResponse | null>
  >;
}) {
  const menuItems = [
    { label: "Personal information", href: "/profile" },
    { label: "Documents", href: "/profile/documents" },
    { label: "Technologies & notifications", href: "/profile/technologies" },
    { label: "Your applications", href: "/profile/candidatures" },
    { label: "Security", href: "/profile/securite" },
    { label: "Resume generator", href: "/profile/generator" },
  ];

  return (
    <div className="flex items-center gap-2">
      <Link
        href={"/profile"}
        className="bg-blue-900 p-2 rounded-lg text-xs md:text-sm text-white font-normal hover:bg-blue-800 hover:cursor-pointer px-2 md:px-4"
      >
        Mange your portfolio
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <User className="text-white hover:cursor-pointer h-5 w-5 md:h-6 md:w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white shadow-md rounded-md"
        >
          {menuItems.map((item, index) => (
            <DropdownMenuItem key={index}>
              <Link href={item.href} className="w-full">
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              onClick={() => {
                localStorage.removeItem("user");
                setIsLoggedIn(false);
                setUser(null);
              }}
              href="/"
              className="w-full"
            >
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function PermissionCompany({
  setIsLoggedIn,
  setUser,
}: {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<
    SetStateAction<AuthCompanyResponse | AuthJobSeekerResponse | null>
  >;
}) {
  const menuItems = [
    { label: "Mange Job Offers", href: "/company" },
    { label: "Enterprise Information", href: "/company/info" },
    { label: "Jobs For Company", href: "/company/jobs" },
    { label: "Security", href: "/company/securite" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="text-white hover:cursor-pointer h-5 w-5 md:h-6 md:w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white shadow-md rounded-md"
      >
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index}>
            <Link href={item.href} className="w-full">
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            onClick={() => {
              localStorage.removeItem("user");
              setIsLoggedIn(false);
              setUser(null);
            }}
            href="/"
            className="w-full"
          >
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OAuth({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigation = useRouter();
  function handleOnClickLogin() {
    setOpen(true);
  }
  function handleOnClickRegister() {
    navigation.push("/auth/");
  }
  return (
    <div className="flex gap-3 md:gap-6">
      <Button
        onClick={handleOnClickLogin}
        className="bg-blue-900 border-[1px] border-gray-400 py-1 md:py-2 px-3 md:px-4 text-white font-medium text-base md:text-xl hover:bg-blue-800 hover:cursor-pointer"
      >
        Login
      </Button>
      <Button
        onClick={handleOnClickRegister}
        className="bg-white py-1 md:py-2 px-3 md:px-4 text-blue-950 font-medium text-base md:text-xl hover:bg-gray-100 hover:cursor-pointer"
      >
        Register
      </Button>
    </div>
  );
}
