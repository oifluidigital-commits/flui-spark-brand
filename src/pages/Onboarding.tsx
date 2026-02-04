import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Palette, Target, Zap, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Perfil', icon: User, description: 'Seus dados básicos' },
  { id: 2, title: 'Marca', icon: Palette, description: 'Identidade e tom' },
  { id: 3, title: 'Objetivos', icon: Target, description: 'Metas de conteúdo' },
  { id: 4, title: 'Sprint', icon: Zap, description: 'Primeiro projeto' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboardingStep, completeOnboarding, setUser, user } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    // Step 1
    name: user.name,
    company: user.company || '',
    role: user.role || '',
    // Step 2
    tone: [] as string[],
    targetAudience: '',
    industry: '',
    // Step 3
    publishingFrequency: '',
    platforms: [] as string[],
    mainGoal: '',
    // Step 4
    sprintName: '',
    sprintDuration: '30',
    sprintTheme: '',
  });
  
  const progress = (currentStep / steps.length) * 100;
  
  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      completeOnboardingStep();
    } else {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setUser((prev) => ({
        ...prev,
        name: formData.name,
        company: formData.company,
        role: formData.role,
      }));
      
      completeOnboarding();
      setIsLoading(false);
      navigate('/dashboard');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const toggleArrayValue = (field: 'tone' | 'platforms', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };
  
  const toneOptions = ['Profissional', 'Casual', 'Inspirador', 'Educativo', 'Provocativo', 'Empático'];
  const platformOptions = ['LinkedIn', 'Instagram', 'Twitter/X', 'YouTube', 'TikTok', 'Newsletter'];
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Flui</h1>
        <p className="text-muted-foreground">Configure sua estratégia de conteúdo</p>
      </div>
      
      {/* Progress */}
      <div className="w-full max-w-2xl mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'flex flex-col items-center gap-1',
                currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  currentStep > step.id && 'bg-primary border-primary text-primary-foreground',
                  currentStep === step.id && 'border-primary text-primary',
                  currentStep < step.id && 'border-border'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Card */}
      <Card className="w-full max-w-2xl border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = steps[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5 text-primary" />;
            })()}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa ou marca</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nome da sua empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo ou função</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ex: Head de Marketing"
                />
              </div>
            </>
          )}
          
          {/* Step 2: Brand */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label>Tom de voz (selecione até 3)</Label>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((tone) => (
                    <Badge
                      key={tone}
                      variant={formData.tone.includes(tone) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-colors',
                        formData.tone.includes(tone) && 'bg-primary'
                      )}
                      onClick={() => {
                        if (formData.tone.length < 3 || formData.tone.includes(tone)) {
                          toggleArrayValue('tone', tone);
                        }
                      }}
                    >
                      {tone}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Público-alvo</Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Descreva seu público ideal..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Nicho ou indústria</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nicho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tecnologia</SelectItem>
                    <SelectItem value="marketing">Marketing Digital</SelectItem>
                    <SelectItem value="business">Negócios</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="health">Saúde e Bem-estar</SelectItem>
                    <SelectItem value="finance">Finanças</SelectItem>
                    <SelectItem value="creative">Criativo</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência de publicação desejada</Label>
                <Select
                  value={formData.publishingFrequency}
                  onValueChange={(value) => setFormData({ ...formData, publishingFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Com que frequência quer publicar?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="3-5">3-5 vezes por semana</SelectItem>
                    <SelectItem value="2-3">2-3 vezes por semana</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="biweekly">Quinzenalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plataformas principais</Label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((platform) => (
                    <Badge
                      key={platform}
                      variant={formData.platforms.includes(platform) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-colors',
                        formData.platforms.includes(platform) && 'bg-primary'
                      )}
                      onClick={() => toggleArrayValue('platforms', platform)}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainGoal">Principal objetivo</Label>
                <Select
                  value={formData.mainGoal}
                  onValueChange={(value) => setFormData({ ...formData, mainGoal: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="O que você quer alcançar?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authority">Construir autoridade</SelectItem>
                    <SelectItem value="audience">Crescer audiência</SelectItem>
                    <SelectItem value="leads">Gerar leads</SelectItem>
                    <SelectItem value="sales">Aumentar vendas</SelectItem>
                    <SelectItem value="community">Criar comunidade</SelectItem>
                    <SelectItem value="brand">Fortalecer marca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {/* Step 4: Sprint */}
          {currentStep === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sprintName">Nome do sprint</Label>
                <Input
                  id="sprintName"
                  value={formData.sprintName}
                  onChange={(e) => setFormData({ ...formData, sprintName: e.target.value })}
                  placeholder="Ex: Lançamento do Produto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sprintDuration">Duração (dias)</Label>
                <Select
                  value={formData.sprintDuration}
                  onValueChange={(value) => setFormData({ ...formData, sprintDuration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="21">21 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sprintTheme">Tema principal</Label>
                <Textarea
                  id="sprintTheme"
                  value={formData.sprintTheme}
                  onChange={(e) => setFormData({ ...formData, sprintTheme: e.target.value })}
                  placeholder="Descreva o foco principal deste sprint..."
                  rows={3}
                />
              </div>
              
              <div className="bg-secondary p-4 rounded-lg">
                <h4 className="font-medium mb-2">🎉 Pronto para começar!</h4>
                <p className="text-sm text-muted-foreground">
                  Ao finalizar, você terá acesso completo ao Flui com seu primeiro sprint configurado.
                </p>
              </div>
            </>
          )}
          
          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading ? (
                'Configurando...'
              ) : currentStep === 4 ? (
                <>
                  Finalizar
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
