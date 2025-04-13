// components/ui/FieldPassword.tsx
"use client";
import { Eye, EyeOff } from "lucide-react";
import React, { forwardRef, useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
}

const FieldPassword = forwardRef<HTMLInputElement, Props>(
    ({ placeholder, disabled, ...rest }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className={`flex px-2 py-3 border-[1px] border-gray-200 rounded-lg ${disabled ? 'bg-gray-50' : ''}`}>
                <input
                    ref={ref}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    className="flex-1 outline-none text-sm bg-transparent"
                    disabled={disabled}
                    {...rest}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                    className="text-gray-500 cursor-pointer"
                >
                    {showPassword ? (
                        <Eye className="w-5 h-5" />
                    ) : (
                        <EyeOff className="w-5 h-5" />
                    )}
                </button>
            </div>
        );
    }
);

FieldPassword.displayName = "FieldPassword";

export default FieldPassword;