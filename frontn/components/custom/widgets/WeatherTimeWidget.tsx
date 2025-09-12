import { Clock, Cloud, Sun } from "lucide-react";

export default function WeatherTimeWidget() {
  // Dans un vrai projet, ces données viendraient d'une API
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-black shadow-[0px_4px_0px_0px_rgba(0,_0,_0,_0.8)] col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <h3 className="font-medium">Amiens, FR</h3>
        </div>
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5" />
          <span>19°C</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Cloud className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">Partiellement nuageux</span>
      </div>
    </div>
  );
}
