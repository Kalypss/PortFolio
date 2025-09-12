import { Briefcase, GraduationCap } from "lucide-react";

export default function ExperienceWidget() {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-black shadow-[0px_4px_0px_0px_rgba(0,_0,_0,_0.8)] col-span-2">
      <div className="flex items-center gap-2">
        <Briefcase className="w-5 h-5" />
        <h3 className="font-medium">Experience & Education</h3>
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 mt-1" />
          <div>
            <p className="font-['DM_Serif_Display'] text-lg">Master en Informatique</p>
            <p className="text-sm text-gray-600">Université de Picardie Jules Verne</p>
            <p className="text-sm text-gray-600">2023 - 2025</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 mt-1" />
          <div>
            <p className="font-['DM_Serif_Display'] text-lg">Développeur Full Stack</p>
            <p className="text-sm text-gray-600">Entreprise XYZ</p>
            <p className="text-sm text-gray-600">Stage - 6 mois</p>
          </div>
        </div>
      </div>
    </div>
  );
}
