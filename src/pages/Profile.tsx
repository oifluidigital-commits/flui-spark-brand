import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Mail,
  Building,
  Briefcase,
  Bell,
  Shield,
  Clock,
  Sparkles,
  Camera,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { user, setUser, isAuthLoading } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    company: user.company || '',
    role: user.role || '',
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: true,
    marketing: false,
  });
  
  const handleSave = () => {
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      company: formData.company,
      role: formData.role,
    }));
    setIsEditing(false);
  };
  
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Skeleton loading
  if (isAuthLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-[28px] font-semibold leading-tight">Perfil</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações e configurações
          </p>
        </div>
        
        {/* Profile Card */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-xl">{user.name || 'Sem nome'}</CardTitle>
                  <CardDescription>{user.email || 'Sem email'}</CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    {user.company && (
                      <Badge variant="outline" className="text-xs">
                        <Building className="h-3 w-3 mr-1" />
                        {user.company}
                      </Badge>
                    )}
                    {user.role && (
                      <Badge variant="outline" className="text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant={isEditing ? 'default' : 'outline'}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? 'Salvar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Nome</div>
                    <div className="font-medium">{user.name || '—'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{user.email || '—'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Empresa</div>
                    <div className="font-medium">{user.company || '—'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Cargo</div>
                    <div className="font-medium">{user.role || '—'}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Usage Stats */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Estatísticas de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {(user.aiCredits.total - user.aiCredits.used).toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-muted-foreground">Créditos Restantes</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="text-3xl font-bold">
                  {user.aiCredits.used.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-muted-foreground">Créditos Usados</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="text-3xl font-bold">
                  {user.aiCredits.total > 0
                    ? Math.round((user.aiCredits.used / user.aiCredits.total) * 100)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Consumo Mensal</div>
              </div>
            </div>

            {user.aiCredits.total > 0 &&
              (user.aiCredits.total - user.aiCredits.used) / user.aiCredits.total < 0.2 && (
                <div className="pt-4 border-t border-border mt-4">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => navigate('/pricing')}
                  >
                    <Sparkles className="h-4 w-4" />
                    Obter mais créditos
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você quer receber atualizações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações importantes no seu email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumo Semanal</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo semanal das suas atividades
                </p>
              </div>
              <Switch
                checked={notifications.weekly}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Receba novidades e ofertas especiais
                </p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Activity History - empty state */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ClipboardList className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium mb-1">Nenhuma atividade registrada ainda</p>
              <p className="text-sm text-muted-foreground">
                Suas ações recentes aparecerão aqui conforme você usar a plataforma.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Security */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alterar Senha</Label>
                <p className="text-sm text-muted-foreground">
                  Última alteração há 30 dias
                </p>
              </div>
              <Button variant="outline">Alterar</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
