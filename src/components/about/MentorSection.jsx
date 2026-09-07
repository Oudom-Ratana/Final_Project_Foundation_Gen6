
import { MENTORS } from "../../data/aboutData";
import MemberCard from "./MemberCard";

export default function MentorSection() {
  return (
    <section className="space-y-8 py-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-[#B90101] dark:text-white tracking-wider uppercase">
          OUR MENTORS
        </h2>
        <div className="w-16 h-1 mx-auto rounded-full bg-[#B90101]" />
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {MENTORS.map((mentor) => (
          <MemberCard key={mentor.id} member={mentor} />
        ))}
      </div>
    </section>
  );
}