import { TEAM_MEMBERS } from "../../data/aboutData";
import MemberCard from "./MemberCard";
import ScrollReveal from "../common/ScrollReveal";

export default function TeamSection() {
  return (
    <section className="space-y-8 py-6 font-sans">
      <ScrollReveal>
        <div className="text-center space-y-2">
          <h2 className="text-h2 font-black text-[var(--primary-red)] dark:text-white tracking-wider uppercase">
            MEET OUR TEAM
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full bg-[var(--primary-red)]" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5   justify-items-center">
        {TEAM_MEMBERS.map((member, index) => (
          <ScrollReveal
            key={member.id}
            delay={index * 90}
            className="w-full flex justify-center"
          >
            <MemberCard member={member} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
