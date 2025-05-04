"use client";
import Container from "@/components/layout/Container";
import Image from "next/image";
import logoImage from "../../../public/logo.png";
import { Button } from "@/components/ui/button";
import Model from "@/components/ui/Model";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Field from "@/components/ui/Field";
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
      window.dispatchEvent(new Event("local-storage-change")); // 👈 Custom event
      window.dispatchEvent(new Event("storage")); // 👈 For cross-tab sync
      document.body.style.overflow = "";
    },
    onError() {
      toast.error("invalid email or password");
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
        window.dispatchEvent(new Event("local-storage-change")); // 👈 Custom event
        window.dispatchEvent(new Event("storage")); // 👈 For cross-tab sync
        document.body.style.overflow = "";
      },
      onError() {
        toast.error("invalid email or password");
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
    <form
      className="flex flex-col p-3 md:p-4 gap-4 md:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-gray-950 text-lg md:text-xl font-bold">Login</p>

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <RadioGroup
            className="flex self-center items-center gap-6 md:gap-8"
            value={field.value}
            onValueChange={field.onChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="User" id="role-user" />
              <Label htmlFor="role-user">User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Company" id="role-company" />
              <Label htmlFor="role-company">Company</Label>
            </div>
          </RadioGroup>
        )}
      />

      <div className="flex-1 border-[1px] border-gray-200 my-2 md:my-4" />

      {/* Email Field */}
      <Field
        label="Email"
        style="gap-3 md:gap-14"
        placeholder="Email"
        type="email"
        register={register("email", { required: "Email is required" })}
      />
      {errors.email && (
        <p className="text-red-600 text-xs md:text-sm">
          {errors.email.message}
        </p>
      )}

      <Field
        label="Password"
        placeholder="Password"
        type="password"
        register={register("password", {
          required: "Password is required",
        })}
      />
      {errors.password && (
        <p className="text-red-600 text-xs md:text-sm">
          {errors.password.message}
        </p>
      )}

      <a className="text-xs md:text-sm underline font-medium text-cyan-500 self-end">
        Forgot your password?
      </a>

      <div className="flex flex-col sm:flex-row sm:self-end gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-3 h-3 md:w-4 md:h-4 hover:cursor-pointer"
            {...register("remember")}
          />
          <span className="text-gray-950 font-medium text-sm md:text-lg">
            Remember me
          </span>
        </label>

        <Button
          type="submit"
          className="bg-blue-500 text-white font-medium text-sm"
          disabled={isPending || isLoginCompany}
        >
          {isPending || isLoginCompany ? "Login..." : "LOGIN"}
        </Button>
      </div>
    </form>
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
