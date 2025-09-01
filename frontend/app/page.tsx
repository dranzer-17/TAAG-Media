import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle"; // Import the toggle
import { ArrowRight, Zap, Target, FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground aurora-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Taag<span className="text-blue-500">.</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center pt-24 pb-32">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Intelligent Creator Matching
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
            Connect your brand with the perfect creators using our AI-powered platform.
            Seamlessly match, manage, and process payments.
          </p>
          <div className="mt-10">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Features Section - with Glassmorphism */}
        <section className="container mx-auto px-6 pb-32">
          <div className="grid gap-8 md:grid-cols-3">
            <GlassFeatureCard
              icon={<Zap className="h-8 w-8 text-blue-400" />}
              title="AI-Powered Matching"
              description="Our algorithm finds creators that perfectly align with your brand's goals, audience, and tone."
            />
            <GlassFeatureCard
              icon={<Target className="h-8 w-8 text-blue-400" />}
              title="Audience Fit Scoring"
              description="Ensure you reach the right people with a detailed score based on audience demographics and location."
            />
            <GlassFeatureCard
              icon={<FileText className="h-8 w-8 text-blue-400" />}
              title="Streamlined Billing"
              description="Easily capture brand and creator details with built-in validation and automated tax calculation."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

// Reusable Glassmorphism Feature Card
function GlassFeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="
      p-8 rounded-2xl
      bg-white/5 border border-white/10
      backdrop-blur-lg
      shadow-2xl shadow-black/20
      transform hover:-translate-y-2 transition-transform duration-300
    ">
      <div className="bg-slate-900/50 border border-white/10 p-3 rounded-full w-fit">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-100">{title}</h3>
      <p className="mt-2 text-slate-400">{description}</p>
    </div>
  );
}