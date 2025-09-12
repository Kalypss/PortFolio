import Image from "next/image";


export default function HeroSection() {
    return (

        <div className="flex flex-col items-center justify-end min-h-[100vh] gap-0">
            <div className="text-center pb-40">
                <h2 className="text-4xl font-normal font-['DM_Serif_Display']">Florian SILVA</h2>
                <h1 className="text-8xl font-black tracking-tighter">PortFolio</h1>
            </div>
            <Image src="/assets/avatar.png" alt="Avatar image." width={400} height={400} className="rounded-4xl" />
      </div>
    )}