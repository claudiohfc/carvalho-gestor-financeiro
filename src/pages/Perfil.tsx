import { useState } from 'react';
import { User, Building2, Mail, LogOut, Save, Moon } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function Perfil() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Carlos Carvalho',
    email: 'carlos@carvalhoconsultores.com.br',
    company: 'Carvalho Consultores Associados LTDA',
    role: 'Gestor Administrativo e Financeiro',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyReport: true,
    compactView: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    toast({
      title: 'Perfil atualizado',
      description: 'Suas informações foram salvas com sucesso.',
    });
  };

  const handleLogout = () => {
    toast({
      title: 'Logout',
      description: 'Você foi desconectado (simulação).',
    });
  };

  return (
    <MainLayout>
      <Header title="Meu Perfil" subtitle="Gerencie suas informações e preferências" />

      <div className="p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card className="glass-card border-border">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <CardDescription>{profile.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company">Empresa</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="bg-background border-border flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Salvando...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Preferências</CardTitle>
              <CardDescription>Configure notificações e aparência</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber alertas e atualizações por e-mail
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, emailNotifications: checked })
                  }
                />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Relatório Semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber resumo financeiro toda segunda-feira
                  </p>
                </div>
                <Switch
                  checked={preferences.weeklyReport}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, weeklyReport: checked })
                  }
                />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Visualização Compacta</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduzir espaçamento nas tabelas e cards
                  </p>
                </div>
                <Switch
                  checked={preferences.compactView}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, compactView: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Logout Card */}
          <Card className="glass-card border-border border-destructive/20">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Sair da Conta</h3>
                  <p className="text-sm text-muted-foreground">
                    Encerrar sua sessão atual
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
