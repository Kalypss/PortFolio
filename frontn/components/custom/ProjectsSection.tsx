import Folder from '@/components/Folder'

export default function ProjectsSection() {
  return (
    <div className="flex min-h-[100vh] items-center flex-col justify-center  pt-20">
      <h2 className="text-black pb-40 font-bold text-4xl tracking-tighter">My projects</h2>
      <Folder size={2.5} color="#5227FF" items={["Project 1", "Project 2", "Project 3"]} className="custom-folder" />
    </div>
  )
}