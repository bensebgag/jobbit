import Container from "../components/layout/Container";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import ilustration from "@/../public/home-1.png"
import SetJobsSection from "@/components/layout/SetJobsSection";
import CurrentTechnolgies from "@/components/layout/CurrentTechnolgies";
import AboutUs from "@/components/layout/AboutUs";
import Footer from "@/components/layout/Footer";
import Navigation from "@/components/ui/Navigation";
import {KeyWordsContextProvider} from "@/contextes/KeyWordsContext";

export default function Home() {
  return (
    <div className="bg-gray-100">
             <Navigation/>
             <Container styleElement={"flex flex-row items-center justify-between mt-20"}>
           <div className={"flex flex-col items-center gap-3 p-2"}>
           <h1 className={"text-gray-950 font-bold text-5xl "}>
                Promote and
                Calorize {" "}
           <span className={"text-blue-600"}>IT talents </span>
                {" "} in Algeria
            </h1>
            <p className={"text-gray-950 font-medium text-lg"}>
                    JoBBit is the reference of IT recrutmenet in
                    Algeria . we help the candidates and the
                    companies to find the perfect match
            </p>
               <div className={"self-start flex gap-2"}>
                 <Button className={"bg-green-700 text-white font-medium"}>Apply</Button>
                 <Button className={"bg-white border-[1px] border-gray-400 text-gray-950 font-medium"}>Publish a job offer</Button>
               </div>
            </div>
           <Image className={"w-[50%]"} src={ilustration} alt={"Illustration"}/>
        </Container>
       <KeyWordsContextProvider>
       <SearchBar />
        <SetJobsSection />
       </KeyWordsContextProvider>


        <CurrentTechnolgies/>
        <AboutUs/>
        <Footer/>

    </div>
  );
}
