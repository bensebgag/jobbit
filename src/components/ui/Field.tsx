"use client"
import {ReactNode} from "react";
import useFocus from "@/hooks/useFocus";
import { UseFormRegisterReturn} from "react-hook-form";
interface Props {
    label: string;
    placeholder: string;
    style?: string;
    type?: string;
    icon?: ReactNode;
    register?: UseFormRegisterReturn<any>;
}

export  default  function Field({label,placeholder,type="text" ,style,icon ,register}:Props){
 const {ref,isFocused,handleFocus}=useFocus();
    return (
        <div  className={`flex items-center gap-4  ${style}`}>
            <label className={"text-gray-950 text-xl font-normal"}>{label}</label>
            <div ref={ref} className={`flex items-center px-2 py-4  flex-1 border-1 ${isFocused?"border-blue-600 border-2":"border-gray-400 "} rounded-sm`}>
            <input   {...(register || {})}  type={type} onFocus={()=>handleFocus()} className={"flex-1 outline-none"} placeholder={placeholder}/>
                {icon && icon}
             </div>
        </div>
    )
}