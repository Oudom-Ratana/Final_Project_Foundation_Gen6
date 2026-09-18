import { MENTORS } from "../../data/aboutData";
import MemberCard from "./MemberCard";
import ScrollReveal from "../common/ScrollReveal";

export default function MentorSection() {
  return (
    <section className="space-y-8 py-6 font-sans">
      <ScrollReveal>
        <div className="text-center space-y-2">
          <h2 className="text-h2 font-black text-[var(--primary-red)] dark:text-white tracking-wider uppercase">
            OUR MENTORS
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full bg-[var(--primary-red)]" />
        </div>
      </ScrollReveal>

      <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-items-center">
        {MENTORS.map((mentor, index) => (
          <ScrollReveal
            key={mentor.id}
            delay={index * 120}
            className="w-full flex justify-center"
          >
            <MemberCard member={mentor} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
