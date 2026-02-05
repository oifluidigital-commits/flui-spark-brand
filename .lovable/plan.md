

# Plano: Pagina de Login com Autenticacao Real (Supabase)

## Objetivo
Construir uma pagina de login completa e funcional com autenticacao real usando Supabase Auth (Email/Password + Google OAuth), substituindo toda logica mock por integracao real com o backend.

---

## Arquitetura da Solucao

```text
+------------------+       +-------------------+       +------------------+
|   Login.tsx      |  -->  |  useAuth hook     |  -->  |  Supabase Auth   |
| (UI + Forms)     |       | (Auth logic)      |       |  (Backend)       |
+------------------+       +-------------------+       +------------------+
        |                         |                          |
        v                         v                          v
  - Email/Password        - signInWithPassword       - auth.users
  - Google OAuth          - signInWithOAuth          - Session mgmt
  - Error handling        - getSession               - JWT tokens
  - Loading states        - onAuthStateChange        
                                  |
                                  v
                          +------------------+
                          |  profiles table  |
                          | (User data)      |
                          +------------------+
                                  |
                                  v
                          +------------------+
                          |   AppContext     |
                          | (Global state)   |
                          +------------------+
```

---

## Componentes a Criar/Modificar

### 1. Hook useAuth (NOVO)
**Arquivo:** `src/hooks/useAuth.ts`

Responsabilidades:
- Encapsular toda logica de autenticacao Supabase
- Gerenciar estados de loading/error
- Expor funcoes de login, logout, signup
- Monitorar mudancas de sessao

```typescript
export function useAuth() {
  return {
    // Auth state
    user: AuthUser | null,
    session: Session | null,
    isLoading: boolean,
    
    // Auth methods
    signInWithEmail: (email, password) => Promise<{ error }>,
    signInWithGoogle: () => Promise<{ error }>,
    signUp: (email, password, name) => Promise<{ error }>,
    signOut: () => Promise<void>,
    
    // Profile methods
    fetchProfile: (userId) => Promise<Profile>,
    createProfile: (userData) => Promise<void>,
  }
}
```

### 2. Login.tsx (REFATORAR COMPLETAMENTE)
**Arquivo:** `src/pages/Login.tsx`

Alteracoes:
- Remover toda logica mock
- Integrar hook useAuth
- Adicionar validacao de formularios com Zod
- Implementar estados de loading, erro e sucesso
- Adicionar toggle para criar conta
- Exibir erros inline abaixo dos inputs
- Chamar Google OAuth via Lovable Cloud

### 3. Signup.tsx (NOVO)
**Arquivo:** `src/pages/Signup.tsx`

Responsabilidades:
- Formulario de criacao de conta
- Campos: nome, email, senha, confirmar senha
- Validacao com Zod
- Chamada a supabase.auth.signUp
- Redirecionamento para /onboarding apos sucesso

### 4. AppContext.tsx (MODIFICAR)
**Arquivo:** `src/contexts/AppContext.tsx`

Alteracoes:
- Adicionar verificacao de sessao no mount
- Integrar com onAuthStateChange listener
- Sincronizar estado do usuario com profile do banco
- Expor funcao de logout global

### 5. App.tsx (MODIFICAR)
**Arquivo:** `src/App.tsx`

Alteracoes:
- Adicionar rota /signup
- Melhorar ProtectedRoute para verificar sessao real
- Adicionar AuthProvider wrapper

### 6. AuthLayout.tsx (MELHORAR)
**Arquivo:** `src/components/layout/AuthLayout.tsx`

Alteracoes:
- Adicionar suporte a dark/light mode
- Melhorar layout visual conforme design system
- Adicionar animacoes suaves

---

## Estados de Interface

### Loading State (Verificando Sessao)
- Tela de loading centralizada com spinner
- Logo Flui animado
- Mensagem "Verificando sessao..."

### Login Form State
- Inputs para email e senha
- Botao "Entrar" com loading spinner
- Separador "ou continue com"
- Botao Google OAuth
- Link para "Criar conta"
- Link para "Esqueci minha senha"

### Error States
- Erro inline vermelho abaixo do input afetado
- Toast com mensagem de erro
- Mensagens especificas para:
  - "Email ou senha incorretos"
  - "Conta nao encontrada"
  - "Email ja cadastrado"
  - "Senha muito fraca"

### Success State
- Redirecionamento automatico
- Toast de boas-vindas (opcional)

---

## Detalhes Tecnicos

### Verificacao de Sessao (On Mount)
```typescript
useEffect(() => {
  // Setup listener BEFORE getSession
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session) {
        const profile = await fetchProfile(session.user.id);
        updateAppState(profile);
        redirectBasedOnOnboarding(profile);
      } else {
        setIsAuthenticated(false);
      }
    }
  );

  // Then check existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      handleSession(session);
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

### Email/Password Login
```typescript
const signInWithEmail = async (email: string, password: string) => {
  setIsLoading(true);
  setError(null);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      setError('Email ou senha incorretos');
    } else {
      setError('Erro ao fazer login. Tente novamente.');
    }
    return { error };
  }
  
  // Fetch profile and redirect
  const profile = await fetchProfile(data.user.id);
  return { error: null, profile };
};
```

### Google OAuth (Lovable Cloud)
```typescript
// Necessita configurar via supabase--configure-social-auth tool
import { lovable } from "@/integrations/lovable/index";

const signInWithGoogle = async () => {
  const { error } = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });
  
  if (error) {
    toast.error('Erro ao conectar com Google');
  }
};
```

### Fetch/Create Profile
```typescript
const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code === 'PGRST116') {
    // Profile not found - should not happen if trigger is working
    return null;
  }
  
  return data;
};
```

### Redirect Logic
```typescript
const redirectBasedOnOnboarding = (profile: Profile) => {
  if (profile.onboarding_status === 'completed') {
    navigate('/dashboard');
  } else {
    navigate('/onboarding');
  }
};
```

### Form Validation (Zod)
```typescript
const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: 'Email invalido' })
    .max(255, { message: 'Email muito longo' }),
  password: z.string()
    .min(6, { message: 'Senha deve ter no minimo 6 caracteres' }),
});

const signupSchema = loginSchema.extend({
  name: z.string()
    .trim()
    .min(2, { message: 'Nome deve ter no minimo 2 caracteres' })
    .max(100, { message: 'Nome muito longo' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas nao conferem',
  path: ['confirmPassword'],
});
```

---

## Arquivos a Criar

| Arquivo | Tipo | Descricao |
|---------|------|-----------|
| `src/hooks/useAuth.ts` | Hook | Encapsula autenticacao Supabase |
| `src/pages/Signup.tsx` | Pagina | Formulario de cadastro |

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Login.tsx` | Refatorar para auth real |
| `src/contexts/AppContext.tsx` | Adicionar sessao real e onAuthStateChange |
| `src/App.tsx` | Adicionar rota /signup |
| `src/components/layout/AuthLayout.tsx` | Melhorar visual |

---

## Fluxo do Usuario

### Login com Email/Password
1. Usuario acessa /login
2. App verifica sessao existente (getSession)
3. Se sessao valida: redireciona baseado em onboarding
4. Se nao: exibe formulario de login
5. Usuario preenche email e senha
6. Clica em "Entrar"
7. Loading spinner no botao
8. Se sucesso: fetch profile -> redirect
9. Se erro: exibe mensagem inline + toast

### Login com Google
1. Usuario clica em "Continuar com Google"
2. Lovable Cloud redireciona para Google OAuth
3. Usuario autoriza
4. Retorna para /login com sessao
5. onAuthStateChange detecta sessao
6. Fetch profile (ja criado pelo trigger)
7. Redirect baseado em onboarding

### Novo Usuario (Signup)
1. Usuario clica em "Criar conta" no login
2. Navega para /signup
3. Preenche nome, email, senha
4. Clica em "Criar conta"
5. signUp cria usuario em auth.users
6. Trigger handle_new_user cria profile
7. Redirect para /onboarding

---

## Integracao com Google OAuth

Para habilitar o Google OAuth, sera necessario usar a ferramenta `supabase--configure-social-auth` com provider "google". Isso ira:

1. Gerar o modulo `@lovable.dev/cloud-auth-js`
2. Criar arquivos em `src/integrations/lovable/`
3. Configurar OAuth managed pelo Lovable Cloud

O codigo usara:
```typescript
import { lovable } from "@/integrations/lovable/index";

await lovable.auth.signInWithOAuth("google", {
  redirect_uri: window.location.origin,
});
```

---

## Secao Tecnica

### Dependencias Existentes
- `@supabase/supabase-js` (ja instalado)
- `zod` (ja instalado)
- `react-hook-form` (ja instalado)
- `@hookform/resolvers` (ja instalado)
- `sonner` (ja instalado)

### Trigger Existente
O banco ja possui o trigger `handle_new_user` que cria automaticamente um profile quando um novo usuario e criado em auth.users:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$function$
```

### RLS Policies (profiles)
- Users can insert own profile
- Users can update own profile
- Users can view own profile

### Campos do Profile
- user_id (uuid) - referencia auth.users
- email (text)
- name (text)
- avatar_url (text)
- onboarding_status (enum: not_started, in_progress, completed)
- onboarding_step (integer)
- plan (enum: free, pro, studio)
- ai_credits_total (integer)
- ai_credits_used (integer)
- company (text)
- role (text)

---

## Consideracoes de Seguranca

1. Emails sao normalizados (lowercase + trim) antes de enviar
2. Senhas nunca sao logadas no console
3. Erros genericos para evitar enumeration attacks
4. RLS garante isolamento de dados entre usuarios
5. Sessoes persistidas com autoRefreshToken habilitado

