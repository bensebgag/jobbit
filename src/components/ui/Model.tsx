"use client"

import { useEffect } from "react";
import useClickOutside from "@/hooks/useClickOutside";
interface Props {
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}
const Modal = ({ isOpen,onClose, children }:Props) => {
    const containerRef = useClickOutside<HTMLDivElement>(() =>onClose(false));

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div  className="fixed inset-0 flex items-center justify-center bg-black/50 shadow-sm   z-50">
            <div  ref={containerRef} className="bg-white  rounded-lg shadow-lg max-w-md w-full relative">

                {children}
            </div>
        </div>
    );
};

export default Modal;