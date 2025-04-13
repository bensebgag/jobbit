"use client";
import JobSection from "@/components/layout/JobSection";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import Container from "@/components/layout/Container";
import {useKeyWords} from "@/contextes/KeyWordsContext";
import {ChevronLeft} from "lucide-react";






export default function SetJobsSection() {
    const [showIndex, setShowIndex] = useState<null | number>(null);

    const [next , setNext] = useState(3);
    const [prev, setPrev] = useState(0);
    const {dataFilter:section,showAll,setShowAll,setKeyWords,isLoading,isError,error}=useKeyWords()


   function handleNext() {
       if (section.length > next && next+3<=section.length) {
          setPrev(next);
          setNext((prev)=>prev + 3);
       }
       else if (section.length > next &&next+3>section.length){
          setPrev(next);
         setNext((prev)=>prev+((prev+3)-section.length));
       }

   }
  function handlePrev() {

       if (prev> 0 && prev-3>=0) {
          setNext(prev);
          setPrev((prev)=>prev-3);
       }

       else if(prev>0 && prev-3<0){
         setNext(prev);
           setPrev((prev)=>(prev -3)+(-(prev-3)));

       }
   }
    function  handelOnClickBack(){
        setShowAll(false);
        setKeyWords([]);
        setShowIndex(null);
    }
    if(isError)return <p>{error.message}</p>
if(isLoading) return <p>...loding</p>
    return (
        <div className={"flex flex-col gap-8"}>
            { showAll && <ChevronLeft onClick={handelOnClickBack} className={"text-white w-12 h-12 p-1  bg-blue-500 rounded-full hover:cursor-pointer "} /> }
        <div >
            {section &&
                (showIndex === null
                    ? section.slice(prev,next).map((s, index:number) => (
                        <JobSection
                            key={index}
                            index={index}
                            title={s.categoryName}
                            data={s.jobLists}
                            setShowIndex={setShowIndex}


                        />
                    ))
                    : section
                        .filter((_, index:number) => index === showIndex)
                        .map((s, index:number) => (
                            <JobSection
                                key={index}
                                index={index}
                                title={s.categoryName}
                                data={s.jobLists}
                                setShowIndex={setShowIndex}
                                showAll={showAll}
                                setShowAll={setShowAll}
                            />
                        )))}

            {
                showIndex === null &&
                <Container>
               <div className={"flex items-center gap-4 mt-10 justify-self-end"}>
                    <Button disabled={prev===0} onClick={handlePrev}>
                        prevous
                    </Button>
                    <Button disabled={next===section.length} onClick={handleNext}>
                        next
                    </Button >
                </div>
                </Container>

            }
        </div>
            </div>
    );
}
