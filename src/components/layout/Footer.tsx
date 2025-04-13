import Container from "@/components/layout/Container";
import Image from "next/image";
import logoImage from "@/../public/logo.png"

export default  function Footer(){
    return (

       <footer className={" bg-blue-900 p-20"}>
          <Container styleElement={"grid grid-cols-4 gap-3 "}>
         <div className={"flex flex-col gap-4"}>
             <div className={"flex items-center gap-2"}>
            <Image src={logoImage} alt={"logo"} />
                 <p className={"text-xl text-white font-bold"}>JOBBIT</p>
             </div>
             <p className={"text-sm text-white font-normal leading-normal"}>
                 Job bit, First platform specializing in IT recruitment in Algeria
             </p>
         </div>

      <div className={"flex flex-col gap-4"}>
          <p className={"text-2xl text-white font-bold"}> About </p>
             <p className={"text-sm text-white font-normal leading-normal"}>
                 Recruiter area
                 Who are we
                 How it works ?
                 Why Trust Me
                 Partners
             </p>
         </div>

          <div className={"flex flex-col gap-4"}>
          <p className={"text-2xl text-white font-bold"}> Client area</p>
             <p className={"text-sm text-white font-normal leading-normal"}>
                 Registration
                 Advanced search
                 Current technologies
                 Trust Me Community
                 FAQ
             </p>
         </div>
          <div className={"flex flex-col gap-4"}>
          <p className={"text-2xl text-white font-bold"}> Contact </p>
             <p className={"text-sm text-white font-normal leading-normal"}>
                 DATAFIRST Technology 117, Lot CADAT, Les Sources،, Bir Mourad Raïs 16000, Algérie

             </p>
         </div>
             </Container>
       </footer>
        )

}