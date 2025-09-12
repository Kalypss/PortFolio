import { Globe2 } from "lucide-react";

export default function LanguagesWidget() {
  const languages = [
    { name: "Français", level: "Natif" },
    { name: "English", level: "Professional" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-black shadow-[0px_4px_0px_0px_rgba(0,_0,_0,_0.8)]">
      <div className="flex items-center gap-2">
        <Globe2 className="w-5 h-5" />
        <h3 className="font-medium">Languages</h3>
      </div>
      <div className="mt-2 space-y-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex justify-between items-center">
            <span className="font-['DM_Serif_Display']">{lang.name}</span>
            <span className="text-sm text-gray-600">{lang.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
