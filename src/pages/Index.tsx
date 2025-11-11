import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, TrendingUp, ArrowRight, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">CHINAPAY</span>
          </div>
          <Button className="bg-[var(--gradient-hero)] hover:opacity-90 transition-opacity">
            Começar Agora
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-muted py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--secondary)/0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm font-semibold text-primary">🇧🇷 Brasil ↔ China 🇨🇳</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Pagamentos entre
                <span className="bg-[var(--gradient-hero)] bg-clip-text text-transparent"> Brasil e China </span>
                simplificados
              </h1>
              <p className="text-xl text-muted-foreground">
                Intermediação profissional de pagamentos internacionais com taxas transparentes e conversão em tempo real.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[var(--gradient-hero)] hover:opacity-90 transition-opacity text-lg px-8">
                  Criar Conta
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Saber Mais
                </Button>
              </div>
            </div>

            <div className="lg:pl-12">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Por que escolher a CHINAPAY?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Facilitamos negócios entre Brasil e China com tecnologia e segurança
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-[var(--shadow-primary)] transition-shadow border-2 border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Transferências Rápidas</h3>
              <p className="text-muted-foreground leading-relaxed">
                Processe pagamentos entre Brasil e China em até 24 horas com nossa infraestrutura otimizada.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-[var(--shadow-primary)] transition-shadow border-2 border-border">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">100% Seguro</h3>
              <p className="text-muted-foreground leading-relaxed">
                Conformidade total com regulamentações do Banco Central do Brasil e autoridades chinesas.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-[var(--shadow-primary)] transition-shadow border-2 border-border">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Taxas Competitivas</h3>
              <p className="text-muted-foreground leading-relaxed">
                Apenas 2% por transação, sem taxas ocultas. Câmbio transparente e em tempo real.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-muted-foreground">
              Três passos simples para sua transferência internacional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--gradient-hero)] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Calcule o valor</h3>
              <p className="text-muted-foreground">
                Use nossa calculadora para ver exatamente quanto você vai pagar e receber
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--gradient-hero)] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Inicie a transferência</h3>
              <p className="text-muted-foreground">
                Envie os detalhes e confirme a transação em nossa plataforma segura
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--gradient-hero)] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Receba o pagamento</h3>
              <p className="text-muted-foreground">
                O destinatário recebe em até 24 horas, com confirmação em tempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-light to-primary-dark text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já facilitam seus negócios entre Brasil e China com a CHINAPAY
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-12 h-14">
            Criar Conta Grátis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">CHINAPAY</span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2025 CHINAPAY. Intermediação profissional de pagamentos Brasil-China.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Termos</a>
              <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
