import { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, TrendingUp, HelpCircle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  { icon: HelpCircle, text: 'Como funciona o Simulador de Cenários?' },
  { icon: TrendingUp, text: 'Explique o que é EBITDA e como interpretar.' },
  { icon: DollarSign, text: 'Como precificar um novo serviço de consultoria?' },
  { icon: Sparkles, text: 'Quais indicadores devo acompanhar mensalmente?' },
];

const mockResponses: Record<string, string> = {
  'como funciona o simulador de cenários?':
    '**Simulador de Cenários** permite modelar impactos estratégicos sem risco operacional.\n\nVocê pode simular:\n- **Contratação de pessoal** — inclui salário, encargos (FGTS, INSS, IR), benefícios e 13º\n- **Reajuste de preços** — aplique índices como IGPM ou IPCA sobre seus produtos\n- **Perda de clientes** — veja o impacto na receita, margem e caixa em 3, 6 e 12 meses\n\nCada simulação mostra um comparativo **Antes x Depois** com gráficos de impacto.',
  'explique o que é ebitda e como interpretar.':
    '**EBITDA** (Earnings Before Interest, Taxes, Depreciation and Amortization) é o lucro antes de juros, impostos, depreciação e amortização.\n\n**Como interpretar:**\n- Mede a **capacidade operacional** de gerar caixa\n- Quanto maior, melhor a eficiência operacional\n- No seu dashboard, o EBITDA atual é **R$ 89.500** com margem de **22,4%**\n- Compare com o período anterior para identificar tendências\n\n**Dica:** Um EBITDA crescente com receita estável indica ganho de eficiência.',
  'como precificar um novo serviço de consultoria?':
    'Para precificar um serviço de consultoria, siga esta estrutura:\n\n1. **Custos Fixos** — aluguel proporcional, software, infraestrutura\n2. **Custos Variáveis** — materiais, deslocamento, ferramentas específicas\n3. **Mão de Obra** — horas dedicadas × valor/hora do consultor\n4. **Margem de Lucro** — defina entre 30% e 50% para consultoria\n5. **Impostos** — ISS (2-5%), PIS/COFINS (3,65% ou 9,25%)\n\n**Fórmula:** `Preço = (Custos + Mão de Obra) × (1 + Margem%) + Impostos`\n\nUse a aba **Precificação de Produtos e Serviços** para simular valores em tempo real.',
  'quais indicadores devo acompanhar mensalmente?':
    'Os **indicadores essenciais** para acompanhamento mensal são:\n\n📊 **Financeiros:**\n- Receita total e crescimento MoM\n- EBITDA e margem operacional\n- Fluxo de caixa líquido\n\n💰 **Custos:**\n- CPS (Custo da Prestação de Serviços)\n- Gasto médio diário\n- Relação custos fixos/variáveis\n\n👥 **Clientes:**\n- CAC (Custo de Aquisição)\n- Receita por cliente\n- Inadimplência (% e dias médios)\n\n📈 **Estratégicos:**\n- Real vs Orçado\n- Ciclo de Conversão de Caixa\n- Margem de Lucro Líquida\n\nTodos disponíveis no **Dashboard Analítico**.',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, val] of Object.entries(mockResponses)) {
    if (lower.includes(key.slice(0, 20)) || key.includes(lower.slice(0, 20))) return val;
  }
  return `Obrigado pela sua pergunta sobre "${input}".\n\nComo assistente financeiro, posso ajudá-lo com:\n- **Uso do sistema** — navegação, funcionalidades e atalhos\n- **Indicadores financeiros** — explicações e interpretações\n- **Precificação** — composição de preços e margens\n- **Estratégia** — análise de cenários e decisões\n\nPoderia reformular sua pergunta para que eu possa dar uma resposta mais precisa?`;
}

export default function AssistenteIA() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const response = getResponse(text);
    const assistantMsg: Message = { id: `a-${Date.now()}`, role: 'assistant', content: response, timestamp: new Date() };
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      let processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-muted rounded text-xs">$1</code>');
      if (line.startsWith('- ')) {
        processed = `<span class="text-primary mr-1">•</span>${processed.slice(2)}`;
        return <div key={i} className="pl-2 py-0.5" dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <MainLayout>
      <Header title="Assistente de IA" subtitle="Apoio inteligente para gestão financeira e uso do sistema" />
      <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
        <Card className="glass-card flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Como posso ajudar?</h3>
                  <p className="text-sm text-muted-foreground mt-1">Pergunte sobre indicadores, precificação, uso do sistema ou estratégias de negócio.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s.text)}
                      className="flex items-center gap-2 text-left text-xs px-3 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <s.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map(msg => (
                  <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'assistant' && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      'max-w-[75%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-foreground border border-border'
                    )}>
                      {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="bg-muted/50 border border-border rounded-xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta..."
                className="text-sm h-10"
                disabled={isLoading}
              />
              <Button size="icon" className="h-10 w-10" onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
