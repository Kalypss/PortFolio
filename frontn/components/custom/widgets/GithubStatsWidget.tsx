import { Github } from "lucide-react";

export default function GithubStatsWidget() {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-black shadow-[0px_4px_0px_0px_rgba(0,_0,_0,_0.8)] row-span-2">
      <div className="flex items-center gap-2">
        <Github className="w-5 h-5" />
        <h3 className="font-medium">Github Activity</h3>
      </div>
      <div className="mt-4 space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Contributions</span>
            <span className="font-['DM_Serif_Display'] text-xl">1,337</span>
          </div>
          <div className="h-2 bg-black/10 rounded-full mt-1">
            <div className="h-full w-3/4 bg-[#8343FF] rounded-full"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Repositories</span>
            <span className="font-['DM_Serif_Display'] text-xl">42</span>
          </div>
          <div className="h-2 bg-black/10 rounded-full mt-1">
            <div className="h-full w-1/2 bg-[#8343FF] rounded-full"></div>
          </div>
        </div>
        <div className="pt-4 border-t border-black/10">
          <p className="text-sm text-gray-600">Latest Project</p>
          <p className="font-medium mt-1">Portfolio - Next.js + TypeScript</p>
          <p className="text-sm text-gray-600 mt-1">Updated 2 days ago</p>
        </div>
      </div>
    </div>
  );
}
