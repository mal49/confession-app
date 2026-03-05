import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Cloud,
  Heart,
  Shield,
  Lock,
  Sparkles,
  Users,
  MessageCircle,
  Send,
  Eye,
} from "lucide-react";

function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      iconBg: "bg-[#FFD93D]",
      title: "Anonymous First",
      description: "We never ask for your name, email, or any personal information. Your identity stays completely hidden.",
    },
    {
      icon: Heart,
      iconBg: "bg-[#FF7EB3]",
      title: "Judgment-Free Zone",
      description: "Share your thoughts without fear. Our community is built on empathy and understanding, not criticism.",
    },
    {
      icon: Lock,
      iconBg: "bg-[#4A90E2]",
      title: "Secure & Private",
      description: "Your data is encrypted and protected. We hash IP addresses and never track or share your information.",
    },
    {
      icon: Eye,
      iconBg: "bg-[#9B59B6]",
      title: "Moderated Content",
      description: "Every confession is reviewed to ensure a safe, respectful environment for everyone.",
    },
  ];

  const stats = [
    { value: "100%", label: "Anonymous" },
    { value: "0", label: "Data Sold" },
    { value: "∞", label: "Safe Space" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden">
      {/* Decorative Clouds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-[#E8F4FD] animate-float">
          <Cloud className="w-24 h-24" strokeWidth={1.5} />
        </div>
        <div className="absolute top-40 right-20 text-[#FDE8F0] animate-float-delayed">
          <Cloud className="w-32 h-32" strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-40 left-20 text-[#FEF7E8] animate-float">
          <Cloud className="w-20 h-20" strokeWidth={1.5} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b-[3px] border-[#2D3436]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/ceritaAnonLogo.png"
              alt="ceritaAnon"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain -mr-2 sm:-mr-3 self-center"
            />
            <span className="font-display font-bold text-lg sm:text-xl text-[#2D3436] leading-none">ceritaAnon</span>
          </a>

          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 font-display font-bold text-[#2D3436]"
          >
            <span className="text-sm hidden sm:inline group-hover:-translate-x-1 transition-transform">Back</span>
            <div className="w-10 h-10 rounded-full bg-[#FF7EB3] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[3px_3px_0px_#2D3436] group-hover:shadow-[4px_4px_0px_#2D3436] group-hover:-translate-y-0.5 group-active:shadow-[1px_1px_0px_#2D3436] group-active:translate-y-0.5 transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD93D]/20 border-[2px] border-[#FFD93D] mb-6">
              <Sparkles className="w-4 h-4 text-[#FFD93D]" />
              <span className="font-body text-sm text-[#2D3436] font-medium">Our Story</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-[#2D3436] mb-6">
              A Safe Space for
              <span className="text-[#FF7EB3]"> Unspoken Words</span>
            </h1>

            <p className="font-body text-lg md:text-xl text-[#636E72] max-w-2xl mx-auto mb-8">
              ceritaAnon was born from a simple idea: everyone deserves a place to share their thoughts freely, 
              without judgment or fear. We&apos;re here to listen, one confession at a time.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-4xl md:text-5xl font-bold text-[#2D3436] mb-1">
                    {stat.value}
                  </div>
                  <div className="font-body text-sm text-[#636E72]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-4 py-12 bg-white border-y-[3px] border-[#2D3436]">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D3436] mb-4">
                  Our Mission
                </h2>
                <p className="font-body text-[#636E72] mb-4">
                  We believe in the power of sharing. Sometimes, the heaviest burdens become lighter 
                  when spoken aloud—even to strangers. ceritaAnon provides that outlet.
                </p>
                <p className="font-body text-[#636E72] mb-4">
                  Every confession is a story. Every story matters. By creating a judgment-free space, 
                  we hope to foster empathy and connection in a world that often feels disconnected.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-12 h-12 rounded-full bg-[#1DD1A1] border-[3px] border-[#2D3436] flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[#2D3436]">Posted to Threads</p>
                    <p className="font-body text-sm text-[#636E72]">Approved confessions are shared anonymously</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-[#E8F4FD] rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8">
                  <div className="w-16 h-16 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-[#2D3436]" />
                  </div>
                  <p className="font-display text-xl font-bold text-[#2D3436] text-center mb-2">
                    &ldquo;Your voice matters&rdquo;
                  </p>
                  <p className="font-body text-[#636E72] text-center">
                    Whether it is a secret, a regret, or a random thought—share it here. 
                    We are listening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D3436] mb-4">
                What We Stand For
              </h2>
              <p className="font-body text-[#636E72] max-w-xl mx-auto">
                Our core values guide everything we do, from how we build our platform 
                to how we treat every confession.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-6 hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${value.iconBg} border-[3px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#2D3436]`}>
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#2D3436] mb-2">
                        {value.title}
                      </h3>
                      <p className="font-body text-[#636E72]">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16 bg-[#E8F4FD]/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D3436] text-center mb-12">
              How It Works
            </h2>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Write Your Confession",
                  description: "Share what is on your mind. No sign-up required, completely anonymous.",
                  color: "bg-[#FFD93D]",
                },
                {
                  step: "2",
                  title: "Submit for Review",
                  description: "Your confession goes to our moderation queue to ensure it meets our community guidelines.",
                  color: "bg-[#FF7EB3]",
                },
                {
                  step: "3",
                  title: "Get Posted",
                  description: "Approved confessions are shared anonymously on our Threads account for the community to see.",
                  color: "bg-[#1DD1A1]",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-6 bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-6"
                >
                  <div className={`w-14 h-14 rounded-2xl ${item.color} border-[3px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#2D3436]`}>
                    <span className="font-display text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#2D3436] mb-1">
                      {item.title}
                    </h3>
                    <p className="font-body text-[#636E72]">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-[#FFD93D]/20 to-[#FF7EB3]/20 rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8 md:p-12">
              <div className="w-16 h-16 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#2D3436]">
                <Users className="w-8 h-8 text-[#2D3436]" />
              </div>
              <h2 className="font-display text-3xl font-bold text-[#2D3436] mb-4">
                Ready to Share?
              </h2>
              <p className="font-body text-[#636E72] mb-6">
                Join thousands of others who have found comfort in sharing their unspoken words. 
                Your confession is safe with us.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-4 rounded-full font-display font-bold text-lg bg-[#FF7EB3] text-white border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] hover:shadow-[8px_8px_0px_#2D3436] hover:-translate-y-1 transition-all"
              >
                Start Confessing
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-[3px] border-[#2D3436] py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/ceritaAnonLogo.png"
                alt="ceritaAnon"
                className="w-12 h-12 object-contain"
              />
              <span className="font-display font-bold text-lg text-[#2D3436]">ceritaAnon</span>
            </a>
            
            <div className="flex items-center gap-6">
              <a href="/about" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                About
              </a>
              <a href="/faq" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                FAQ
              </a>
              <a href="/privacy" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Privacy
              </a>
              <a
                href="https://www.buymeacoffee.com/ikhmalhanif"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors flex items-center gap-1">
                <span>☕</span> Buy me a coffee
              </a>
              <span className="font-body text-sm text-[#B2BEC3]">Made with 💕</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-[#DFE6E9] text-center">
            <p className="font-body text-xs text-[#B2BEC3]">
              A safe space for the unspoken. Built with care and lots of doodles.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
