"use client"
import Container from "@/components/layout/Container";
import Image from "next/image";
import logoImage from "../../../public/logo.png";
import {Button} from "@/components/ui/button";
import Model from "@/components/ui/Model";
import { useState} from "react";
import gogoleIcon from "@/../public/Frame.png";
import Field from "@/components/ui/Field";
import {useRouter} from "next/navigation";
import {User} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export  default function  Navigation (){
   const [open, setOpen] = useState(false);

   enum Role{
       COMPANY = "COMPANY",
       USER = "USER",
   }

 const isLogin=true;
  const roule:Role = "COMPANY"



    return (
        <nav className={"bg-blue-900 p-2"}>
            <Container styleElement={"flex flex-row items-center justify-between"}>
                <div className={"flex items-center gap-2 "}>
                   <Image className={"w-12 h-12"} src={logoImage} alt={'logo'} />
                    <p className={"text-white font-bold text-2xl  "}>JOBBIT</p>
                </div>
                {
                    isLogin ? (
                        roule === Role.USER ? <PermissionUser /> : <PermissionCompany />
                    ) : (
                        <OAuth setOpen={setOpen} />
                    )
                }

            </Container>
            <Model isOpen={open} onClose={setOpen} >

                <Login/>


            </Model>
        </nav>
    )
}

function Login (){
    return (
        <div className={"flex flex-col p-4  gap-5"}>
           <p className={"text-gray-950 text-xl font-bold"}>login</p>
           <Button className={"bg-white border-[2px] border-gray-500 rounded-full text-gray-950 font-normal self-center hover:bg-blue-200 hover:text-gray-800 hover:cursor-pointer"}>
               <p>Sign in with</p>
           <Image src={gogoleIcon} alt={"gogle icon"}/>
           </Button>
            <div className={"flex-1 border-[1px] border-gray-200 my-4"}></div>
            <form className={"flex flex-col gap-4"}>
               <Field style={"gap-15"} type={"email"} label={"Email"} placeholder={"Email"}/>
                <Field label={"Password"} type={"password"} placeholder={"Password"}/>
                <a className={"text-sm underline font-medium text-cyan-500 self-end"}>forget your password?</a>
                <div className={'flex self-end gap-4'}>
                    <div className={'flex items-center gap-2'}>
                   <input className={"w-4 h-4 hover:cursor-pointer "} type={"checkbox"}/>
                        <p className={"text-gray-950 font-medium text-lg"}>Remember me</p>
                    </div>
                <Button className={"bg-blue-500 text-white font-medium text-sm"}>LOGIN</Button>
                </div>
            </form>
        </div>
    )
}
function PermissionUser() {
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
            <Button className="bg-blue-900 text-sm text-white font-normal hover:bg-transparent hover:cursor-pointer">
                MANAGE YOUR PORTFOLIO
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <User className="text-white hover:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white shadow-md rounded-md">
                    {menuItems.map((item, index) => (
                        <DropdownMenuItem key={index}>
                            <Link href={item.href} className="w-full">
                                {item.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/logout" className="w-full">
                            Log out
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
function  PermissionCompany(){
    const menuItems = [
        { label: "MANGE JOB OFFERS",href: "/company"  },
        { label: "ENTERPRISE INFORMATION " , href: "/company/info" },
        { label: "SECURITY", href: "/company/securite" },

    ];

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <User className="text-white hover:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white shadow-md rounded-md">
                {menuItems.map((item, index) => (
                    <DropdownMenuItem key={index}>
                        <Link href={item.href} className="w-full">
                            {item.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="/logout" className="w-full">
                        Log out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
function OAuth({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }){
    const navigation =useRouter();
    function  handleOnClickLogin(){
        setOpen(true);
    }
    function  handleOnClickRegister(){
        navigation.push('/auth/');
    }
    return (
        <div className={"flex gap-6"}>
            <Button onClick={handleOnClickLogin} className={"bg-blue-900 border-[1px] border-gray-400 py-2 px-4  text-white font-medium text-xl hover:bg-blue-900 hover:cursor-pointer "} >Login</Button>
            <Button onClick={handleOnClickRegister} className={"bg-white py-2 px-4  text-blue-950 font-medium text-xl hover:bg-white hover:cursor-pointer"} >register</Button>
        </div>
    )
}