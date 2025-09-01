import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  ArrowRight, 
  Zap, 
  Target, 
  FileText,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  CheckCircle,
  Star
} from "lucide-react";
import Link from "next/link";
import SplashCursor from '@/components/SplashCursor'



export default function Home() {
  return (
    
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Taag Media
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-muted/50 transition-colors">
                Features
              </Button>
              <Button variant="ghost" className="hidden sm:inline-flex hover:bg-muted/50 transition-colors">
                About
              </Button>
              <Link href="/login">
                <Button variant="outline" className="border-border/50 hover:bg-muted/50 text-xs sm:text-sm px-3 sm:px-4">
                  Sign In
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>
      <SplashCursor />
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-20 sm:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-6 sm:mb-8">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              AI-Powered Creator Matching Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6 px-4 sm:px-0">
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Connect Brands with
            </span>
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Perfect Creators
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4 sm:px-0">
            Leverage AI to discover, match, and manage creator partnerships that drive real results. 
            Streamlined billing and payments included.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Start Matching Now
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-border/50 hover:bg-muted/50 transition-colors">
              Watch Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-muted-foreground text-xs sm:text-sm px-4 sm:px-0">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>10,000+ Active Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>500+ Brands Trust Us</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>98% Match Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent px-4 sm:px-0">
            Everything You Need to Scale
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            From intelligent matching to seamless payments, we've built the complete creator marketing solution.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="AI-Powered Matching"
            description="Our advanced algorithm analyzes 50+ data points to find creators that perfectly align with your brand's voice, audience, and goals."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="Precision Audience Scoring"
            description="Get detailed audience overlap scores with demographic breakdowns, engagement rates, and geographic distribution analysis."
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Streamlined Billing"
            description="Automated invoicing, tax calculations, and secure payment processing. Handle everything from contracts to payouts seamlessly."
            gradient="from-emerald-500 to-teal-500"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Creator Network"
            description="Access our vetted network of 10,000+ creators across all major platforms, from nano to macro influencers."
            gradient="from-orange-500 to-red-500"
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Performance Analytics"
            description="Track campaign performance in real-time with detailed metrics, ROI calculations, and comprehensive reporting."
            gradient="from-indigo-500 to-purple-500"
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure & Compliant"
            description="Enterprise-grade security with automated tax compliance, fraud detection, and secure payment processing."
            gradient="from-slate-500 to-gray-500"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 border border-border/50 p-6 sm:p-12 mx-4 sm:mx-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <StatItem number="10K+" label="Active Creators" />
            <StatItem number="500+" label="Happy Brands" />
            <StatItem number="98%" label="Match Success" />
            <StatItem number="$2M+" label="Processed Payments" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-base sm:text-lg font-semibold">Taag Media</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/50 text-center text-xs sm:text-sm text-muted-foreground">
            © 2024 Taag Media. All rights reserved. Built for the future of creator marketing.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative">
      <div className="relative rounded-xl sm:rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 hover:border-border">
        <div className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${gradient} text-white mb-4 sm:mb-6 shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">{number}</div>
      <div className="text-muted-foreground text-xs sm:text-sm font-medium">{label}</div>
    </div>
  );
}