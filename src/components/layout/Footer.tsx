import Container from "@/components/layout/Container";
import Image from "next/image";
import logoImage from "@/../public/logo.png";

export default function Footer() {
  return (
    <footer className="bg-blue-900 py-12 px-6 md:p-16 lg:p-20">
      <Container styleElement="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
        {/* Logo and Description */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image src={logoImage} alt="logo" />
            <p className="text-xl text-white font-bold">JOBBIT</p>
          </div>
          <p className="text-sm text-white font-normal leading-normal">
            Job bit, First platform specializing in IT recruitment in Algeria
          </p>
        </div>

        {/* About Links */}
        <div className="flex flex-col gap-4">
          <p className="text-xl md:text-2xl text-white font-bold">About</p>
          <div className="flex flex-col gap-2 text-sm text-white font-normal leading-normal">
            <a href="#" className="hover:text-blue-200 transition-colors">
              Recruiter area
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Who are we
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              How it works?
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Why Trust Me
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Partners
            </a>
          </div>
        </div>

        {/* Client Area Links */}
        <div className="flex flex-col gap-4">
          <p className="text-xl md:text-2xl text-white font-bold">
            Client area
          </p>
          <div className="flex flex-col gap-2 text-sm text-white font-normal leading-normal">
            <a href="#" className="hover:text-blue-200 transition-colors">
              Registration
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Advanced search
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Current technologies
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              Trust Me Community
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              FAQ
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-4">
          <p className="text-xl md:text-2xl text-white font-bold">Contact</p>
          <p className="text-sm text-white font-normal leading-normal">
            DATAFIRST Technology 117, Lot CADAT, Les Sources, Bir Mourad Raïs
            16000, Algérie
          </p>
        </div>
      </Container>
    </footer>
  );
}
