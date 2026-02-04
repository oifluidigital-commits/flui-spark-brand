import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Check, Sparkles } from 'lucide-react';
import { mockPricingPlans } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Pricing() {
  const navigate = useNavigate();
  
  const faqs = [
    {
      question: 'Como funcionam os créditos de IA?',
      answer: 'Os créditos de IA são usados cada vez que você utiliza funcionalidades de inteligência artificial, como geração de ideias, sugestões de conteúdo e análises. Cada funcionalidade consome uma quantidade específica de créditos.',
    },
    {
      question: 'Posso trocar de plano a qualquer momento?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O ajuste será feito proporcionalmente ao tempo restante do seu ciclo de cobrança.',
    },
    {
      question: 'Existe um período de teste gratuito?',
      answer: 'O plano Starter é gratuito para sempre com funcionalidades limitadas. Você pode experimentar o Flui sem compromisso e fazer upgrade quando precisar de mais recursos.',
    },
    {
      question: 'Como funciona o cancelamento?',
      answer: 'Você pode cancelar sua assinatura a qualquer momento. Seu acesso continuará até o fim do período já pago. Não fazemos reembolsos proporcionais.',
    },
    {
      question: 'Os créditos acumulam de um mês para outro?',
      answer: 'Não, os créditos de IA não acumulam. Eles são renovados a cada ciclo de cobrança. Recomendamos usar todos os créditos disponíveis antes da renovação.',
    },
  ];
  
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Escolha seu plano</h2>
          <p className="text-muted-foreground mt-2">
            Comece grátis e escale conforme sua necessidade
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'border-border relative hover:border-primary/30 transition-colors',
                plan.isPopular && 'border-primary border-2'
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Mais Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/mês</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center gap-2 p-3 bg-secondary rounded-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">{plan.aiCredits.toLocaleString('pt-BR')} créditos IA</span>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className="w-full"
                  variant={plan.isCurrent ? 'outline' : plan.isPopular ? 'default' : 'secondary'}
                  disabled={plan.isCurrent}
                >
                  {plan.isCurrent ? 'Plano Atual' : plan.price === 0 ? 'Começar Grátis' : 'Fazer Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Perguntas Frequentes</h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {/* CTA */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-bold mb-2">Precisa de um plano personalizado?</h3>
            <p className="text-muted-foreground mb-4">
              Para equipes maiores ou necessidades específicas, entre em contato conosco
            </p>
            <Button variant="outline">
              Falar com Vendas
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
