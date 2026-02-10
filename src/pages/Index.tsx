import { Link } from 'react-router-dom';
import {
  Workflow,
  Target,
  Layers,
  Lightbulb,
  Zap,
  ArrowRight,
  ArrowDown,
  Boxes,
  Sparkles,
  Users,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Data ────────────────────────────────────────────────────────────────────

const painPoints = [
  'Falta de consistência entre o que você planeja e o que publica',
  'Decisões arbitrárias sobre o que postar a cada semana',
  'Alto esforço cognitivo para manter tudo organizado',
  'Execução irregular, mesmo quando tem boas ideias',
];

const flowStages = [
  { title: 'Posicionamento', description: 'Defina para quem você fala e sobre o quê', icon: Target },
  { title: 'Estratégia', description: 'Crie pilares temáticos e linhas editoriais', icon: Layers },
  { title: 'Ideias', description: 'Gere e organize ideias alinhadas à estratégia', icon: Lightbulb },
  { title: 'Execução', description: 'Planeje sprints e produza com IA assistindo cada etapa', icon: Zap },
];

const differentiators = [
  {
    title: 'Sistema completo, não ferramenta isolada',
    description: 'O Flui conecta posicionamento, estratégia, ideias e execução em um único fluxo contínuo',
    icon: Boxes,
  },
  {
    title: 'Estratégia viva, aplicada na prática',
    description: 'Sua estratégia não fica em um documento. Ela governa ideias, priorização e execução em tempo real',
    icon: Target,
  },
  {
    title: 'Execução assistida por IA (não só geração de texto)',
    description: 'A IA ajuda você a decidir o que fazer, estruturar como fazer e acompanhar até a peça final',
    icon: Sparkles,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const Index = () => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <header className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 lg:max-w-[60%]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-zinc-900 mb-6">
              Planeje, produza e execute conteúdo estratégico em um único fluxo contínuo
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-zinc-600 mb-8">
              Do posicionamento à publicação, sem fragmentar ferramentas, ideias ou decisões
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-violet-600 text-white px-6 py-3 h-auto rounded-lg font-medium hover:bg-violet-700 transition-colors focus:ring-2 focus:ring-violet-300 focus:outline-none">
                <Link to="/login">Começar gratuitamente</Link>
              </Button>
              <Button
                variant="outline"
                onClick={scrollToHowItWorks}
                className="border-zinc-300 text-zinc-900 px-6 py-3 h-auto rounded-lg font-medium hover:bg-zinc-50 transition-colors focus:ring-2 focus:ring-zinc-200 focus:outline-none"
              >
                Ver como funciona
              </Button>
            </div>
          </div>

          {/* Visual placeholder (desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div
              className="w-full max-w-md aspect-[4/3] rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' }}
              role="img"
              aria-label="Flui platform workflow illustration"
            >
              <Workflow className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. Problem ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-zinc-900 text-center mb-8 md:mb-12">
            O problema que você já conhece
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {painPoints.map((text, i) => (
              <div
                key={i}
                className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 text-zinc-700 text-base leading-relaxed"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. How it works ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-zinc-900 text-center mb-8 md:mb-12">
            Como o Flui funciona
          </h2>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start justify-center gap-2">
            {flowStages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div key={i} className="flex items-start">
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">{stage.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-600">{stage.description}</p>
                  </div>
                  {i < flowStages.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-zinc-400 mt-3 mx-3 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: vertical */}
          <div className="flex md:hidden flex-col items-center gap-2">
            {flowStages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex flex-col items-center text-center max-w-[260px]">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">{stage.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-600">{stage.description}</p>
                  </div>
                  {i < flowStages.length - 1 && (
                    <ArrowDown className="h-5 w-5 text-zinc-400 my-3" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Differentiators ────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-zinc-900 text-center mb-8 md:mb-12">
            Por que Flui é diferente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {differentiators.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 hover:border-violet-200 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-base leading-relaxed text-zinc-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Social proof (placeholder) ─────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-zinc-900 text-center mb-8 md:mb-12">
            Usado por criadores e founders B2B
          </h2>
          <div className="flex justify-center">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 md:p-12 text-center max-w-md">
              <Users className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-zinc-700 mb-1">Primeiros usuários em onboarding</p>
              <p className="text-sm text-zinc-500">Em breve, depoimentos reais</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-zinc-900 mb-4">
            Comece agora, sem quebrar o fluxo
          </h2>
          <p className="text-base leading-relaxed text-zinc-600 mb-8">
            Trial gratuito • Sem cartão • Estratégia já configurada
          </p>
          <Button asChild className="bg-violet-600 text-white px-6 py-3 h-auto rounded-lg font-medium hover:bg-violet-700 transition-colors focus:ring-2 focus:ring-violet-300 focus:outline-none mb-4">
            <Link to="/login">Começar gratuitamente</Link>
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-sm text-zinc-600">
            <Check className="h-4 w-4 text-emerald-500" />
            Setup guiado em 5 minutos
          </p>
        </div>
      </section>

      {/* ── 7. Footer ────────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 text-center">
          <p className="text-xl font-bold text-violet-600 mb-3">Flui</p>
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 mb-3">
            <span className="hover:text-zinc-700 cursor-pointer">Sobre</span>
            <span>•</span>
            <span className="hover:text-zinc-700 cursor-pointer">Contato</span>
            <span>•</span>
            <span className="hover:text-zinc-700 cursor-pointer">Termos</span>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-zinc-700">Privacidade</Link>
          </div>
          <p className="text-xs text-zinc-400">© 2026 Flui. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
