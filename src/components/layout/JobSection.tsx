"use client"

import Container from "@/components/layout/Container";
import JobCard from "@/components/ui/JobCard";
import {ChevronLeft, ChevronRight} from "lucide-react";
import { motion } from "motion/react";
import {JobDetails} from "@/utils/types";
import {useKeyWords} from "@/contextes/KeyWordsContext";



interface SectionInfo{
 title: string,
 index:number,
 data:JobDetails[];
 setShowIndex:Dispatch<SetStateAction<number | null>>;
}

export  default  function JobSection ({title,data,setShowIndex,index} :SectionInfo){
  function handelOnClickShowAll (){

   setShowAll(true);
   setShowIndex(index);
    }



  function handelClickonkeyWords(){
     setKeyWords(prev=>[...prev,title]);
     setShowIndex(index);
     setShowAll(true);
  }

  const {setKeyWords,showAll,setShowAll}=useKeyWords();

    return (
      <Container styleElement={"mt-20 flex flex-col gap-6  "}>

      <motion.h3 initial={{opacity:0,x:-30}}
                  animate={{opacity:1,x:0}}
                 transition={{duration:0.3}}
                 onClick={handelClickonkeyWords}
                 className={"text-gray-800 font-bold text-2xl mb-2 hover:cursor-pointer"}>

          {title}
      </motion.h3>
      <div className={'grid grid-cols-2 gap-8 '} >
          {data.length>7 && !showAll? data.slice(0,6).map((item:JobDetails,index:number) => (
          <motion.div
           key={index}
           initial={{ opacity: 0, x: -40 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.2, delay: index * 0.1 }}
          >

           <JobCard
           image={item.logoPath}
           title={item.title}
           siklsImages={item.skills}
           location={item.wilayaName}
           nameCampny={item.companyName}
           date={item.postedDate}/>
          </motion.div>

          )) :data.map((item:JobDetails,index:number) => (
          <motion.div
           key={index}
           initial={{ opacity: 0, x: -40 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.2, delay: index * 0.1 }}
          >

           <JobCard
          image={item.logoPath}
           title={item.title}
           siklsImages={item.skills}
           location={item.wilayaName}
           nameCampny={item.companyName}
           date={item.postedDate}/>
           </motion.div>
                  ))}
       </div>
          {data.length >7 && !showAll &&(
          <div onClick={handelOnClickShowAll} className={"flex items-center gap-2 self-center p-2 rounded-lg" +
              " hover:cursor-pointer hover:bg-blue-100 transition "}>
          <ChevronRight className={"text-white w-8 h-8 p-1  bg-blue-500 rounded-full "} />
          <p className={"text-blue-500 text-lg font-medium "}>All {data.length-7} job offers {title} </p>
          </div>
          )}
      </Container>

    )
}