import {MapPin} from "lucide-react";
import Image from "next/image";
import {SikllsDetail} from "@/utils/types";

interface  Item{
image:string;
title:string;
siklsImages:SikllsDetail[];
location:string;
nameCampny:string;
date:Date;
}


export  default  function JobCard({image,title,siklsImages,location,nameCampny,date}:Item){
    const isValidUrl = (url: string) => url.startsWith("http");

    return (
       <div


           className={"flex-col items-center p-2 gap-2 justify-between bg-white rounded-xl shadow-lg shadow-gray-400"}>
           <div className={"flex items-center gap-1 justify-self-end "}>

                {siklsImages.length>0&&siklsImages.map((img:SikllsDetail,index:number) => (
                <div key={index} className={"flex-col bg-gray-400 rounded-full w-7 h-8 hover:cursor-pointer "}>
                    <Image
                        width={28}
                        height={24}
                        className={"w-7 h-6 rounded-full self-start "}
                        src={img.iconUrl}
                        alt={img.name} />
                </div>
                     ))}



         </div>
              <div className={"flex items-center gap-4"}>
                  <Image
                  width={96}
                  height={96}
                  className={"w-24 h-24"}
                  src={isValidUrl(image) ? image: "/placeholder.png"}
                  alt={"ja"} />
                  <div className={"flex flex-col  gap-2"}>
                  <p className={'text-xl font-medium  text-gray-950 '}>{title}</p>
                  <p className={"text-lg font-normal  justify-self-start text-gray-800 "}>{nameCampny}</p>
                  <p className={"flex gap-1 text-gray-950 text-left font-bold text-sm"}>
                  <MapPin className={"w-4 h-4"} />
                  <span>{location}</span>
                  </p>
                  </div>
              </div>
              <p className={"text-gray-800 text-sm font-medium justify-self-end "}>{date.toString()}</p>
          </div>
    )
}