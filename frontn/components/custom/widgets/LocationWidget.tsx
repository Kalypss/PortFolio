import { MapPin } from "lucide-react";

export default function LocationWidget() {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-black shadow-[0px_4px_0px_0px_rgba(0,_0,_0,_0.8)]">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        <h3 className="font-medium">Location</h3>
      </div>
      <p className="mt-2 text-xl font-['DM_Serif_Display']">Amiens, France</p>
    </div>
  );
}
