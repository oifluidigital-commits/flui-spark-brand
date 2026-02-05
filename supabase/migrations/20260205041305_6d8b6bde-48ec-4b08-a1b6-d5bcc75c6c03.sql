-- =============================================
-- FLUI - Estrutura de Dados Base
-- =============================================

-- 1. Enum para planos
CREATE TYPE public.plan_type AS ENUM ('free', 'pro', 'studio');

-- 2. Enum para status de onboarding
CREATE TYPE public.onboarding_status AS ENUM ('not_started', 'in_progress', 'completed');

-- 3. Enum para status de sprint
CREATE TYPE public.sprint_status AS ENUM ('draft', 'active', 'completed', 'archived');

-- 4. Enum para status de conteúdo
CREATE TYPE public.content_status AS ENUM ('idea', 'backlog', 'review', 'scheduled', 'completed');

-- 5. Enum para estágio do funil
CREATE TYPE public.funnel_stage AS ENUM ('tofu', 'mofu', 'bofu');

-- 6. Enum para intenção do conteúdo
CREATE TYPE public.content_intention AS ENUM ('educate', 'engage', 'convert');

-- 7. Enum para origem do framework
CREATE TYPE public.framework_origin AS ENUM ('ai', 'manual');

-- 8. Enum para categoria de framework
CREATE TYPE public.framework_category AS ENUM ('storytelling', 'educational', 'sales', 'engagement', 'authority', 'personal');

-- 9. Enum para relevância de tendência
CREATE TYPE public.trend_relevance AS ENUM ('high', 'medium', 'low');

-- 10. Enum para status de ideia
CREATE TYPE public.idea_status AS ENUM ('backlog', 'planned', 'in_progress', 'review', 'published', 'archived');

-- =============================================
-- TABELA: profiles (dados do usuário)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  plan public.plan_type DEFAULT 'free',
  ai_credits_total INTEGER DEFAULT 500,
  ai_credits_used INTEGER DEFAULT 0,
  onboarding_status public.onboarding_status DEFAULT 'not_started',
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- TABELA: diagnostics (diagnóstico do onboarding)
-- =============================================
CREATE TABLE public.diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  form_data JSONB NOT NULL,
  result JSONB,
  ai_model_used TEXT,
  tokens_consumed INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diagnostics"
  ON public.diagnostics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostics"
  ON public.diagnostics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diagnostics"
  ON public.diagnostics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: strategies (estratégia editorial)
-- =============================================
CREATE TABLE public.strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  diagnostic_id UUID REFERENCES public.diagnostics(id),
  data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own strategies"
  ON public.strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strategies"
  ON public.strategies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strategies"
  ON public.strategies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: brands (hub da marca)
-- =============================================
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  colors JSONB DEFAULT '{"primary": "#6366f1", "secondary": "#10b981", "accent": "#f59e0b"}',
  typography JSONB DEFAULT '{"headingFont": "Inter", "bodyFont": "Inter"}',
  voice JSONB,
  positioning JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brands"
  ON public.brands FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands"
  ON public.brands FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON public.brands FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON public.brands FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: content_pillars (pilares de conteúdo)
-- =============================================
CREATE TABLE public.content_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  percentage INTEGER DEFAULT 25,
  color TEXT DEFAULT '#6366f1',
  example_topics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pillars"
  ON public.content_pillars FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pillars"
  ON public.content_pillars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pillars"
  ON public.content_pillars FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pillars"
  ON public.content_pillars FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: sprints
-- =============================================
CREATE TABLE public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status public.sprint_status DEFAULT 'draft',
  theme TEXT,
  pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  alignment_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sprints"
  ON public.sprints FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sprints"
  ON public.sprints FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sprints"
  ON public.sprints FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sprints"
  ON public.sprints FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: sprint_contents
-- =============================================
CREATE TABLE public.sprint_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  hook TEXT,
  description TEXT,
  format TEXT NOT NULL,
  status public.content_status DEFAULT 'idea',
  funnel_stage public.funnel_stage,
  framework TEXT,
  framework_reason TEXT,
  framework_origin public.framework_origin DEFAULT 'manual',
  intention public.content_intention,
  suggested_cta TEXT,
  generated_text TEXT,
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sprint_contents ENABLE ROW LEVEL SECURITY;

-- Policy via sprint ownership
CREATE POLICY "Users can view own sprint contents"
  ON public.sprint_contents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sprints 
      WHERE sprints.id = sprint_contents.sprint_id 
      AND sprints.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sprint contents"
  ON public.sprint_contents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sprints 
      WHERE sprints.id = sprint_contents.sprint_id 
      AND sprints.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sprint contents"
  ON public.sprint_contents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sprints 
      WHERE sprints.id = sprint_contents.sprint_id 
      AND sprints.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sprint contents"
  ON public.sprint_contents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sprints 
      WHERE sprints.id = sprint_contents.sprint_id 
      AND sprints.user_id = auth.uid()
    )
  );

-- =============================================
-- TABELA: trends (radar de tendências)
-- =============================================
CREATE TABLE public.trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  relevance public.trend_relevance,
  category TEXT,
  suggested_actions TEXT[],
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trends"
  ON public.trends FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trends"
  ON public.trends FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trends"
  ON public.trends FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trends"
  ON public.trends FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: ideas (banco de ideias)
-- =============================================
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status public.idea_status DEFAULT 'backlog',
  format TEXT,
  pillar_id UUID REFERENCES public.content_pillars(id) ON DELETE SET NULL,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
  tags TEXT[],
  due_date DATE,
  source_trend_id UUID REFERENCES public.trends(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ideas"
  ON public.ideas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas"
  ON public.ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON public.ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON public.ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: frameworks (biblioteca de frameworks)
-- =============================================
CREATE TABLE public.frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category public.framework_category,
  structure TEXT[],
  example TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.frameworks ENABLE ROW LEVEL SECURITY;

-- Global frameworks (user_id IS NULL) are readable by all authenticated users
CREATE POLICY "Users can view global and own frameworks"
  ON public.frameworks FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert own frameworks"
  ON public.frameworks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own frameworks"
  ON public.frameworks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own frameworks"
  ON public.frameworks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- TABELA: ai_usage_log (log de uso de IA)
-- =============================================
CREATE TABLE public.ai_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  model_used TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  credits_consumed INTEGER,
  request_payload JSONB,
  response_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai usage logs"
  ON public.ai_usage_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai usage logs"
  ON public.ai_usage_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_strategies_updated_at
  BEFORE UPDATE ON public.strategies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_sprints_updated_at
  BEFORE UPDATE ON public.sprints
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_sprint_contents_updated_at
  BEFORE UPDATE ON public.sprint_contents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- FUNÇÃO: Criar perfil automaticamente no signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para criar perfil no signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DADOS INICIAIS: Frameworks globais
-- =============================================
INSERT INTO public.frameworks (user_id, name, description, category, structure, example, is_custom) VALUES
(NULL, 'AIDA', 'Atenção, Interesse, Desejo, Ação - clássico do copywriting', 'sales', 
  ARRAY['Captura a atenção com algo impactante', 'Gere interesse com benefícios', 'Crie desejo emocional', 'Chame para ação clara'],
  'Cansado de perder tempo? Descubra como economizar 10h/semana com automação. Imagine o que faria com esse tempo extra. Clique e comece agora.',
  FALSE),
(NULL, 'PAS', 'Problema, Agitação, Solução - ideal para conteúdo de vendas', 'sales',
  ARRAY['Identifique o problema do leitor', 'Agite as consequências', 'Apresente a solução'],
  'Você tenta criar conteúdo mas não sabe por onde começar. Seus concorrentes crescem enquanto você estagna. Com o Flui, você tem uma estratégia pronta em minutos.',
  FALSE),
(NULL, 'Storytelling Herói', 'A jornada do herói aplicada ao conteúdo', 'storytelling',
  ARRAY['Apresente o herói (você ou cliente)', 'Descreva o desafio', 'Mostre a transformação', 'Revele o resultado'],
  'Há 2 anos eu era invisível no LinkedIn. Postava sem estratégia e nada acontecia. Até que descobri um método. Hoje tenho 50k seguidores.',
  FALSE),
(NULL, 'Lista Numerada', 'Conteúdo em formato de lista com números', 'educational',
  ARRAY['Título com número específico', 'Itens claros e acionáveis', 'Contexto breve por item', 'CTA final'],
  '5 erros que destroem seu engajamento: 1. Postar sem estratégia 2. Ignorar comentários 3. Não usar CTAs...',
  FALSE),
(NULL, 'Antes/Depois', 'Contraste entre situação anterior e atual', 'authority',
  ARRAY['Descreva o antes (dor)', 'Mostre a virada', 'Apresente o depois (transformação)', 'Convide à mesma jornada'],
  'Antes: 200 seguidores, 0 clientes. 6 meses depois: 15k seguidores, faturamento 5x maior. O que mudou? Estratégia.',
  FALSE),
(NULL, 'Tutorial Passo-a-Passo', 'Guia prático com instruções detalhadas', 'educational',
  ARRAY['Introdução breve do resultado', 'Passos numerados e claros', 'Dicas extras por passo', 'Conclusão com próximos passos'],
  'Como criar um carrossel viral: Passo 1: Escolha um tema polêmico. Passo 2: Crie um gancho irresistível...',
  FALSE),
(NULL, 'Opinião Controversa', 'Posicionamento forte que gera debate', 'engagement',
  ARRAY['Afirmação controversa', 'Justificativa lógica', 'Evidências ou exemplos', 'Convite ao debate'],
  'Dica: pare de seguir "dicas de produtividade". A maioria só serve para te deixar ansioso. O que funciona é...',
  FALSE),
(NULL, 'Bastidores', 'Mostra o processo por trás dos resultados', 'personal',
  ARRAY['Contexto do bastidor', 'O que normalmente não é visto', 'Aprendizados ou reflexões', 'Conexão com o público'],
  'O que ninguém vê por trás daquele post viral: 3 horas de pesquisa, 5 versões descartadas, e muita insegurança.',
  FALSE);