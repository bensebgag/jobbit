import Container from "@/components/layout/Container";
import Image from "next/image";
import javascript from "@/../public/js_5968292.png"

export  default function CurrentTechnolgies(){
    const arr=Array.from({length:12});
    return (
        <Container styleElement={"mt-20   "}>
         <div className={"flex flex-col gap-8  "}>
           <h2 className={"text-center text-gray-950 font-bold text-3xl "}>Current technologies</h2>
        <div className={"grid grid-cols-4 gap-x-60 gap-y-8 self-center"}>
            {arr.map((_, index) => (
              <div key={index}>
              <p className={"text-gray-950 font-medium  text-lg"}>javaScript</p>
              <Image className={"w-20 h-20 rounded-full "} src={javascript} alt={"jac"}/>
           </div>
            ))}

        </div>
        </div>
        </Container>
    )
}