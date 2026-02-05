
# Plano de Implementacao — Opcao de Pular Onboarding

## Visao Geral

Adicionar uma opcao para o usuario pular o onboarding apos preencher nome e email (Step 1), permitindo ir diretamente para o dashboard sem completar o diagnostico completo.

---

## 1. Situacao Atual

O onboarding possui 7 etapas obrigatorias:
1. Conta e Identidade (nome + email)
2. Cargo e Experiencia
3. Area de Atuacao
4. Objetivos
5. Topicos de Conteudo
6. Audiencia e Desafios
7. Estilo de Comunicacao

**Problema**: O usuario nao pode acessar o dashboard sem completar todas as 7 etapas.

---

## 2. Comportamento Proposto

| Condicao | Comportamento |
|----------|---------------|
| Step 1 com nome preenchido | Exibe link "Pular e ir para o dashboard" |
| Steps 2-7 | Link continua visivel para pular |
| Usuario clica em "Pular" | Navega para /dashboard com status `in_progress` |

---

## 3. Regras de Negocio

1. O nome deve estar preenchido (minimo 2 caracteres) para habilitar o skip
2. O email ja vem preenchido automaticamente (read-only)
3. Ao pular, o usuario:
   - Tem acesso completo ao dashboard
   - Mantem status de onboarding como `in_progress`
   - Ve o card de progresso no dashboard para retomar depois
4. O skip NAO marca o onboarding como completo

---

## 4. Modificacoes no Onboarding.tsx

### 4.1 Adicionar Funcao de Skip

```typescript
const handleSkipOnboarding = () => {
  // Update user with minimal data (name from step 1)
  setUser((prev) => ({
    ...prev,
    name: formData.name,
    onboardingStatus: 'in_progress',
    onboardingStep: currentStep,
  }));
  
  navigate('/dashboard');
};
```

### 4.2 Condicao para Exibir Skip

O botao de skip so aparece quando:
- O nome tem pelo menos 2 caracteres (`formData.name.trim().length >= 2`)

### 4.3 Estrutura Visual

Adicionar abaixo do indicador de passo atual:

```tsx
{/* Skip option */}
{formData.name.trim().length >= 2 && (
  <button
    onClick={handleSkipOnboarding}
    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
  >
    Pular e ir para o dashboard
  </button>
)}
```

---

## 5. Posicionamento do Skip

```text
+--------------------------------------------------+
|  [Card do Wizard]                                 |
|  ...                                              |
|  [Voltar]                          [Continuar]    |
+--------------------------------------------------+

  Passo 3 de 7

  Pular e ir para o dashboard   <-- Nova opcao
```

---

## 6. Estilizacao

Seguindo o Visual Dictionary:

- `text-muted-foreground` → Cor sutil (nao compete com CTA principal)
- `hover:text-foreground` → Destaque no hover
- `hover:underline` → Indicador visual de link clicavel
- `text-sm` → Tamanho discreto

---

## 7. Estados do Usuario Apos Skip

| Campo | Valor |
|-------|-------|
| `name` | Valor preenchido no Step 1 |
| `onboardingStatus` | `'in_progress'` |
| `onboardingStep` | Step atual no momento do skip |

Isso garante que:
- O card de progresso aparece no dashboard
- O usuario pode retomar de onde parou
- O badge de status mostra "Em andamento" (amber)

---

## 8. Arquivo a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/pages/Onboarding.tsx` | Adicionar funcao `handleSkipOnboarding` e link de skip |

---

## 9. Detalhes Tecnicos

### Codigo Completo da Modificacao

```tsx
// Nova funcao de skip
const handleSkipOnboarding = () => {
  setUser((prev) => ({
    ...prev,
    name: formData.name,
    onboardingStatus: 'in_progress',
    onboardingStep: currentStep,
  }));
  
  navigate('/dashboard');
};

// No JSX, substituir o paragrafo de "Passo X de Y" por:
<div className="flex flex-col items-center gap-2 mt-4">
  <p className="text-xs text-muted-foreground">
    Passo {currentStep} de {stepConfig.length}
  </p>
  
  {formData.name.trim().length >= 2 && (
    <button
      onClick={handleSkipOnboarding}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
    >
      Pular e ir para o dashboard
    </button>
  )}
</div>
```

---

## 10. Comportamento UX

| Acao | Resultado |
|------|-----------|
| Usuario preenche nome no Step 1 | Link de skip aparece |
| Usuario avanca para Step 2+ | Link de skip continua visivel |
| Usuario clica no skip | Vai para dashboard com dados salvos |
| Usuario acessa dashboard | Ve card de progresso para retomar |

---

## 11. Checklist de Entrega

- [ ] Adicionar funcao `handleSkipOnboarding`
- [ ] Adicionar condicional para exibir link de skip
- [ ] Estilizar link conforme design system
- [ ] Testar que skip preserva dados do nome
- [ ] Testar que card de progresso aparece no dashboard
- [ ] Testar que usuario pode retomar onboarding
