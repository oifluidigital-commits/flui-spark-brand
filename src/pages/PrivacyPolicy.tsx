import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicy() {
  const lastUpdated = '10 de fevereiro de 2024';
  
  const sections = [
    {
      title: '1. Informações que Coletamos',
      content: `Coletamos informações que você nos fornece diretamente, como:
      
• Informações de cadastro (nome, email, empresa)
• Dados do seu perfil e preferências
• Conteúdo que você cria na plataforma
• Informações de pagamento (processadas por terceiros seguros)

Também coletamos automaticamente:
• Dados de uso e navegação
• Informações do dispositivo e navegador
• Endereço IP e localização aproximada`,
    },
    {
      title: '2. Como Usamos suas Informações',
      content: `Utilizamos suas informações para:

• Fornecer e melhorar nossos serviços
• Personalizar sua experiência na plataforma
• Processar transações e enviar comunicações relacionadas
• Enviar atualizações sobre o serviço (com seu consentimento)
• Analisar uso e tendências para melhorar o Flui
• Proteger contra fraudes e abusos`,
    },
    {
      title: '3. Compartilhamento de Dados',
      content: `Não vendemos suas informações pessoais. Podemos compartilhar dados com:

• Prestadores de serviço que nos auxiliam (hospedagem, pagamentos, analytics)
• Autoridades legais quando exigido por lei
• Em caso de fusão ou aquisição empresarial

Todos os parceiros são obrigados a proteger suas informações conforme esta política.`,
    },
    {
      title: '4. Uso de Inteligência Artificial',
      content: `O Flui utiliza IA para gerar sugestões e insights de conteúdo. 

• Seus dados são processados para personalizar sugestões
• Não usamos seu conteúdo para treinar modelos públicos
• Você mantém a propriedade de todo conteúdo criado
• Pode desativar funcionalidades de IA a qualquer momento`,
    },
    {
      title: '5. Segurança de Dados',
      content: `Implementamos medidas de segurança robustas:

• Criptografia em trânsito (HTTPS/TLS)
• Criptografia em repouso para dados sensíveis
• Controles de acesso rigorosos
• Monitoramento contínuo de segurança
• Backups regulares e redundância de dados`,
    },
    {
      title: '6. Seus Direitos',
      content: `Você tem direito a:

• Acessar seus dados pessoais
• Corrigir informações incorretas
• Excluir sua conta e dados (direito ao esquecimento)
• Exportar seus dados em formato portátil
• Revogar consentimentos dados anteriormente
• Apresentar reclamação à autoridade de proteção de dados`,
    },
    {
      title: '7. Cookies e Tecnologias Similares',
      content: `Usamos cookies e tecnologias similares para:

• Manter você logado
• Lembrar suas preferências
• Analisar uso da plataforma
• Melhorar a experiência do usuário

Você pode controlar cookies através das configurações do seu navegador.`,
    },
    {
      title: '8. Retenção de Dados',
      content: `Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão:

• Dados pessoais são removidos em até 30 dias
• Backups são removidos em até 90 dias
• Alguns dados podem ser mantidos para obrigações legais
• Dados anonimizados podem ser retidos para análises`,
    },
    {
      title: '9. Menores de Idade',
      content: `O Flui não é destinado a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se identificarmos dados de menores, serão excluídos prontamente.`,
    },
    {
      title: '10. Alterações nesta Política',
      content: `Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas por email ou através da plataforma. O uso continuado do serviço após alterações constitui aceitação da nova política.`,
    },
    {
      title: '11. Contato',
      content: `Para questões sobre privacidade:

Email: privacidade@flui.app
Endereço: Av. Paulista, 1000 - São Paulo, SP

Encarregado de Proteção de Dados (DPO):
dpo@flui.app`,
    },
  ];
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Política de Privacidade</h2>
          <p className="text-muted-foreground mt-2">
            Última atualização: {lastUpdated}
          </p>
        </div>
        
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Seu Resumo de Privacidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No Flui, respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais. 
              Esta política explica como coletamos, usamos e protegemos suas informações quando você usa nossa plataforma.
              Ao usar o Flui, você concorda com as práticas descritas nesta política.
            </p>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="border-border bg-secondary/50">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
