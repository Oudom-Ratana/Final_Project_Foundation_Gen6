import AboutHero from "../components/about/AboutHero";
import MentorSection from "../components/about/MentorSection";
import TeamSection from "../components/about/TeamSection";
import ContactQuickCards from "../components/about/ContactQuickCards";
import ContactForm from "../components/about/ContactForm";
import ContactInfo from "../components/about/ContactInfo";
import ScrollReveal from "../components/common/ScrollReveal";

export default function AboutUsPage() {
  return (
    <div className="space-y-16 pb-20 font-sans overflow-x-hidden">
      {/* 1. About FilmZone Hero Section */}
      <ScrollReveal>
        <AboutHero />
      </ScrollReveal>

      {/* 2. OUR MENTORS Section */}
      <MentorSection />

      {/* 3. MEET OUR TEAM Section */}
      <TeamSection />

      {/* 4. CONTACT US NOW Section */}
      <section className="space-y-10 py-8">
        <ScrollReveal>
          <div className="text-center space-y-2">
            <h2
              className="text-2xl sm:text-3xl font-black tracking-wider uppercase"
              style={{ color: "#B90101" }}
            >
              CONTACT US NOW
            </h2>
            <div
              className="w-16 h-1 mx-auto rounded-full"
              style={{ backgroundColor: "#B90101" }}
            />
          </div>
        </ScrollReveal>

        {/* 4 Quick Support Cards with Continuous Looping Animation */}
        <ScrollReveal delay={100}>
          <ContactQuickCards />
        </ScrollReveal>

        {/* Contact Form & Information (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          <ScrollReveal delay={150} className="lg:col-span-7 h-full">
            <ContactForm />
          </ScrollReveal>
          <ScrollReveal delay={250} className="lg:col-span-5 h-full">
            <ContactInfo />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
