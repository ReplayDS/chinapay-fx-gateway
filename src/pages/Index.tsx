import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, TrendingUp, ArrowRight, Globe, CheckCircle2, XCircle, Lock, AlertTriangle, Languages, User, Store } from "lucide-react";
import { useState } from "react";

const translations = {
  pt: {
    clientLogin: "Login Cliente",
    supplierLogin: "Login Fornecedor",
    getStarted: "Começar Agora",
    heroAlert: "Cansado de ser enganado por fornecedores?",
    heroTitle1: "Chega de",
    heroTitle2: "prejuízo",
    heroTitle3: "com fornecedores chineses",
    heroDescription: "Pagamento seguro até a entrega confirmada.",
    heroDescriptionBold: "Seus produtos chegam ou seu dinheiro volta. Simples assim."
  },
  cn: {
    clientLogin: "客户登录",
    supplierLogin: "供应商登录",
    getStarted: "立即开始",
    heroAlert: "为巴西客户提供安全可靠的收款解决方案",
    heroTitle1: "安全便捷的",
    heroTitle2: "跨境收款",
    heroTitle3: "服务平台",
    heroDescription: "付款安全直到确认交货。",
    heroDescriptionBold: "产品送达或退款。就这么简单。"
  }
};

const Index = () => {
  const [language, setLanguage] = useState<'pt' | 'cn'>('pt');
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">YuanBR</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'pt' ? 'cn' : 'pt')}
              className="gap-2"
            >
              <Languages className="w-4 h-4" />
              {language === 'pt' ? '中文' : 'PT'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              {t.clientLogin}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Store className="w-4 h-4" />
              {t.supplierLogin}
            </Button>
            <Button className="bg-[var(--gradient-hero)] hover:opacity-90 transition-opacity">
              {t.getStarted}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-muted py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--secondary)/0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">{t.heroAlert}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight animate-fade-in">
                {t.heroTitle1}
                <span className="text-destructive"> {t.heroTitle2} </span>
                {t.heroTitle3}
              </h1>
              <p className="text-xl text-muted-foreground animate-fade-in">
                <strong className="text-foreground">{t.heroDescription}</strong> {t.heroDescriptionBold}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in">
                <Button size="lg" className="bg-[var(--gradient-hero)] hover:opacity-90 transition-opacity text-lg px-8 hover-scale">
                  Proteger Meus Pagamentos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Ver Como Funciona
                </Button>
              </div>
            </div>

            <div className="lg:pl-12 animate-fade-in">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Você conhece essa história?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Milhares de empresários perdem dinheiro todos os dias importando da China
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Problemas */}
            <Card className="p-8 border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-destructive" />
                <h3 className="text-2xl font-bold text-destructive">Sem Proteção</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Pagou adiantado e o fornecedor sumiu</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Produto chegou totalmente diferente do combinado</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Qualidade inferior ao prometido nas amostras</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Fornecedor não responde mais após receber o dinheiro</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Perdeu todo o investimento sem recurso</span>
                </li>
              </ul>
            </Card>

            {/* Solução */}
            <Card className="p-8 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 hover-scale transition-transform">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-primary">Com YuanBR</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">Pagamento retido até você confirmar a entrega</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">Produto diferente? Seu dinheiro de volta</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">Qualidade garantida ou reembolso total</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">Fornecedor só recebe após você aprovar</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">Proteção total do início ao fim</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Escrow Explanation */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Sistema de Pagamento Seguro</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Seu dinheiro protegido até a entrega
              </h2>
              <p className="text-xl text-muted-foreground">
                Funciona como um cofre: o dinheiro fica bloqueado e só é liberado quando você confirmar que está tudo certo
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center border-2 border-primary/20 hover-scale transition-transform">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Você Paga</h3>
                <p className="text-sm text-muted-foreground">
                  Seu dinheiro fica retido em segurança na YuanBR
                </p>
              </Card>

              <Card className="p-6 text-center border-2 border-primary/20 hover-scale transition-transform">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Fornecedor Envia</h3>
                <p className="text-sm text-muted-foreground">
                  O fornecedor sabe que receberá e envia seu pedido
                </p>
              </Card>

              <Card className="p-6 text-center border-2 border-primary/20 hover-scale transition-transform">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Você Confirma</h3>
                <p className="text-sm text-muted-foreground">
                  Produto OK? Liberamos o pagamento. Problema? Devolvemos seu dinheiro
                </p>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" className="bg-[var(--gradient-hero)] hover:opacity-90 transition-opacity text-lg px-12 h-14 hover-scale">
                Quero Esta Proteção
                <Shield className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Mais que conversão de moeda
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para proteger seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-[var(--shadow-primary)] transition-all border-2 border-border hover-scale">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Pagamento Seguro</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sistema de escrow que retém o pagamento até você confirmar o recebimento. Zero risco de perder dinheiro.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-[var(--shadow-primary)] transition-all border-2 border-border hover-scale">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Conversão Transparente</h3>
              <p className="text-muted-foreground leading-relaxed">
                Taxa fixa de 2% por transação. Sem surpresas, sem taxas escondidas. Você sabe exatamente quanto vai pagar.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-[var(--shadow-primary)] transition-all border-2 border-border hover-scale">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Suporte Especializado</h3>
              <p className="text-muted-foreground leading-relaxed">
                Equipe bilíngue que entende de comércio Brasil-China. Resolvemos problemas antes que eles aconteçam.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12">
              Empresários que protegem seus negócios
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">R$ 50M+</div>
                <p className="text-muted-foreground">Protegidos em transações</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">0</div>
                <p className="text-muted-foreground">Fraudes consumadas</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Transações sem problemas</p>
              </div>
            </div>

            <Card className="p-8 bg-card border-2 border-border">
              <p className="text-lg text-muted-foreground italic mb-4">
                "Já perdi mais de R$ 80 mil com fornecedores que sumiram. Com a YuanBR, durmo tranquilo sabendo que meu dinheiro só sai quando o produto chega."
              </p>
              <p className="font-semibold text-foreground">— Carlos M., Importador de Eletrônicos</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-light to-primary-dark text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pare de correr riscos desnecessários
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Uma fraude pode acabar com seu negócio. Proteja seus pagamentos hoje mesmo.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-12 h-14 hover-scale">
            Proteger Minha Próxima Importação
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="mt-6 text-sm opacity-80">Sem custos de setup • 100% seguro • Suporte em português</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">YuanBR</span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2025 YuanBR. Protegendo importadores brasileiros desde 2020.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors story-link">Termos</a>
              <a href="#" className="hover:text-primary transition-colors story-link">Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors story-link">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
