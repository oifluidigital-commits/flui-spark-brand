import { Link } from "react-router-dom";
import {
  Layers,
  LayoutDashboard,
  PenTool,
  CalendarRange,
  Database,
  Settings,
  BarChart3,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

// --- Data ---

const beliefs = [
  "More content doesn't mean more authority. It means more noise.",
  "AI can generate words. It cannot generate a point of view.",
  "Without structure, even great ideas disappear in the feed.",
  "Authority compounds. But only when every piece connects to a system.",
];

const categories = [
  {
    icon: BarChart3,
    label: "CRM",
    domain: "Revenue",
    description: "Structures how companies capture, manage, and grow revenue.",
  },
  {
    icon: Settings,
    label: "ERP",
    domain: "Operations",
    description: "Structures how companies coordinate resources and processes.",
  },
  {
    icon: Database,
    label: "Flui",
    domain: "Authority",
    description: "Structures how brands turn narrative into lasting competitive advantage.",
  },
];

const systemLayers = [
  {
    number: "01",
    name: "Studio",
    role: "Command Layer",
    description: "The central space where strategy, narrative, and execution converge into a single operational view.",
    icon: LayoutDashboard,
  },
  {
    number: "02",
    name: "Blueprints",
    role: "Narrative Architecture",
    description: "Define your positioning, pillars, and editorial lines — the structural foundation every piece of content inherits.",
    icon: Layers,
  },
  {
    number: "03",
    name: "Sessions",
    role: "Coordinated Authority Movements",
    description: "Time-bound sprints that align content production to strategic objectives, not arbitrary calendars.",
    icon: CalendarRange,
  },
  {
    number: "04",
    name: "Editor",
    role: "Aligned Execution",
    description: "Produce content that is structurally connected to your narrative — assisted by AI that understands your system.",
    icon: PenTool,
  },
];

const beforeItems = [
  "Disconnected tools for each stage",
  "Content calendar driven by trends",
  "AI generating generic copy",
  "Strategy in a forgotten document",
  "Execution based on inspiration",
];

const afterItems = [
  "One system from positioning to publication",
  "Production driven by strategic pillars",
  "AI aligned to your narrative architecture",
  "Strategy governing every decision in real-time",
  "Execution compounding authority over time",
];

// --- Component ---

const Index = () => {
  const scrollToSystem = () => {
    document.getElementById("system")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">Flui</span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Start your Studio
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero */}
      <section className="pt-32 pb-24 md:pt-44 md:pb-32 lg:pb-40 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
            Authority is not created by volume.{" "}
            <span className="text-violet-600">It's built by system.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto mb-10">
            Flui is the infrastructure that turns narrative into competitive advantage.
            From positioning to publication — one continuous system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="bg-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors focus:ring-2 focus:ring-violet-300 focus:outline-none w-full sm:w-auto text-center"
            >
              Build your Authority System
            </Link>
            <button
              onClick={scrollToSystem}
              className="border border-zinc-200 text-zinc-700 px-6 py-3 rounded-lg font-medium hover:bg-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-200 focus:outline-none w-full sm:w-auto"
            >
              Enter the Studio
            </button>
          </div>
        </div>
      </section>

      {/* 2. Belief Shift */}
      <section className="py-24 md:py-32 px-4 md:px-8 lg:px-16 bg-zinc-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16 text-center">
            The internet doesn't reward content.{" "}
            <span className="text-violet-600">It rewards clarity.</span>
          </h2>
          <div className="space-y-6">
            {beliefs.map((belief, i) => (
              <div key={i} className="border-l-2 border-violet-600 pl-6 py-2">
                <p className="text-lg md:text-xl text-zinc-700 font-medium leading-relaxed">
                  {belief}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Definition */}
      <section className="py-24 md:py-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
            Flui is <span className="text-violet-600">Narrative Infrastructure.</span>
          </h2>
          <p className="text-lg text-zinc-500 text-center max-w-2xl mx-auto mb-16">
            Every category leader has infrastructure for what matters most. Flui creates the missing layer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const isFlui = cat.label === "Flui";
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-8 border transition-all ${
                    isFlui
                      ? "border-violet-200 bg-violet-50/50 shadow-sm"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <Icon
                    size={28}
                    className={isFlui ? "text-violet-600 mb-4" : "text-zinc-400 mb-4"}
                  />
                  <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">
                    {cat.label}
                  </p>
                  <p className={`text-xl font-bold mb-3 ${isFlui ? "text-violet-600" : "text-zinc-900"}`}>
                    Structures {cat.domain}
                  </p>
                  <p className="text-zinc-600 leading-relaxed text-sm">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. System Breakdown */}
      <section id="system" className="py-24 md:py-32 px-4 md:px-8 lg:px-16 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
            The Architecture
          </h2>
          <p className="text-lg text-zinc-500 text-center max-w-xl mx-auto mb-16">
            Four layers. One system. Every piece of content inherits structure.
          </p>
          <div className="space-y-4">
            {systemLayers.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.number}
                  className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 hover:border-violet-200 transition-colors"
                >
                  <div className="flex items-center gap-4 md:w-56 shrink-0">
                    <span className="text-2xl font-bold text-zinc-200">{layer.number}</span>
                    <Icon size={22} className="text-violet-600" />
                    <div>
                      <p className="font-semibold text-zinc-900">{layer.name}</p>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">{layer.role}</p>
                    </div>
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                    {layer.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Differentiation */}
      <section className="py-24 md:py-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            Content tools help you publish.{" "}
            <span className="text-violet-600">Flui helps you dominate narrative.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8">
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Content Tools</p>
              <ul className="space-y-4">
                {[
                  "Generate text from prompts",
                  "Schedule posts on a calendar",
                  "Track engagement metrics",
                  "Manage multiple channels",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-500">
                    <span className="mt-0.5 text-zinc-300">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-violet-200 rounded-2xl p-8 shadow-sm">
              <p className="text-sm font-medium text-violet-600 uppercase tracking-wider mb-6">Flui</p>
              <ul className="space-y-4">
                {[
                  "Define narrative positioning and pillars",
                  "Align every piece to strategic architecture",
                  "Coordinate authority movements in sprints",
                  "Compound brand authority over time",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-800">
                    <ArrowRight size={16} className="mt-1 text-violet-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transformation */}
      <section className="py-24 md:py-32 px-4 md:px-8 lg:px-16 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            The shift
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8">
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Before Flui</p>
              <ul className="space-y-4">
                {beforeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-500">
                    <X size={16} className="mt-1 text-zinc-300 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-violet-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-medium text-violet-600 uppercase tracking-wider mb-6">With Flui</p>
              <ul className="space-y-4">
                {afterItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-800">
                    <Check size={16} className="mt-1 text-violet-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-32 md:py-40 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Build authority that{" "}
            <span className="text-violet-600">compounds.</span>
          </h2>
          <p className="text-zinc-500 text-lg mb-10 max-w-xl mx-auto">
            Stop publishing in fragments. Start building a system.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-violet-700 transition-colors focus:ring-2 focus:ring-violet-300 focus:outline-none"
          >
            Start your Studio
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-zinc-100 py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <span className="text-lg font-bold tracking-tight">Flui</span>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>About</span>
            <span>·</span>
            <span>Contact</span>
            <span>·</span>
            <span>Terms</span>
            <span>·</span>
            <Link to="/privacy-policy" className="hover:text-zinc-600 transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-xs text-zinc-300">© 2026 Flui. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
