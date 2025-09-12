import { Code2 } from "lucide-react";

export default function TechStackWidget() {
  const technologies = [
    "TypeScript",
    "React",
    "Node.js",
    "Next.js",
    "TailwindCSS",
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-black shadow-[0px_4px_0px_0px_rgba(0,_0,_0,_0.8)] col-span-2">
      <div className="flex items-center gap-2">
        <Code2 className="w-5 h-5" />
        <h3 className="font-medium">Tech Stack</h3>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-black/5 rounded-lg text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
