import { Button } from "@/components/ui/button";
import Image from "next/image";
import Heading from "./_components/Heading";
import Heroes from "./_components/Heroes";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <>
      <div className="h-full flex flex-col dark:bg-[#1F1F1F]">
        <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 px-6 pb-10flex-1">
          <Heading />
          <Heroes />
        </div>

        <Footer />
      </div>
    </>
  );
}
