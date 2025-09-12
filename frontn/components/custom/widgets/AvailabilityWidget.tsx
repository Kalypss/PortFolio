import { Timer } from "lucide-react";

export default function AvailabilityWidget() {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-black shadow-[0px_4px_0px_0px_rgba(0,_0,_0,_0.8)]">
      <div className="flex items-center gap-2">
        <Timer className="w-5 h-5" />
        <h3 className="font-medium">Availability</h3>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="font-['DM_Serif_Display'] text-lg">Open to Work</p>
        </div>
        <p className="mt-2 text-sm text-gray-600">Available for freelance projects</p>
        <p className="text-sm text-gray-600">and full-time opportunities</p>
      </div>
    </div>
  );
}
