import LocationWidget from "./widgets/LocationWidget";
import LanguagesWidget from "./widgets/LanguagesWidget";
import WeatherTimeWidget from "./widgets/WeatherTimeWidget";
import VisitorsWidget from "./widgets/VisitorsWidget";
import TechStackWidget from "./widgets/TechStackWidget";
import GithubStatsWidget from "./widgets/GithubStatsWidget";
import ExperienceWidget from "./widgets/ExperienceWidget";
import AvailabilityWidget from "./widgets/AvailabilityWidget";

export default function BentoSection() {
    return (
        <section className="min-h-screen w-full bg-gradient-to-br from-white to-gray-100 py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col items-center justify-center mb-12">
                    <h2 className="text-4xl font-normal font-['DM_Serif_Display']">About Me</h2>
                    <h1 className="text-6xl font-black tracking-tighter">Quick Overview</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
                    <LocationWidget />
                    <LanguagesWidget />
                    <WeatherTimeWidget />
                    <AvailabilityWidget />
                    <GithubStatsWidget />
                    <ExperienceWidget />
                    <TechStackWidget />
                    <VisitorsWidget />
                </div>
            </div>
        </section>
    )
}
