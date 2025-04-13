
interface IProps {
    stepNumber: number;
    descrptionStep:string;
    CurrentStep:number;
}
export  default function Step({stepNumber,descrptionStep,CurrentStep}: IProps ){
    return (
        <div className={"flex items-center gap-3 w-full"}>
       <div className={"flex   items-center  gap-2  "}>
            <span className={`w-6 h-6 rounded-full  ${CurrentStep+1===stepNumber?"bg-blue-500":"bg-gray-500"} text-white font-bold text-sm flex items-center justify-center `}>{stepNumber}</span>
            <p className={"text-sm w-full inline-block  text-gray-800 font-normal"}>{descrptionStep}</p>
        </div>
            {stepNumber !==4 &&<div className={"w-20    border-[1px] border-gray-500"}></div>}
        </div>

    )
}