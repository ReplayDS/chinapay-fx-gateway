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
    heroDescriptionBold: "Seus produtos chegam ou seu dinheiro volta. Simples assim.",
    protectPayments: "Proteger Meus Pagamentos",
    seeHowItWorks: "Ver Como Funciona",
    problemTitle: "Você conhece essa história?",
    problemSubtitle: "Milhares de empresários perdem dinheiro todos os dias importando da China",
    withoutProtection: "Sem Proteção",
    problem1: "Pagou adiantado e o fornecedor sumiu",
    problem2: "Produto chegou totalmente diferente do combinado",
    problem3: "Qualidade inferior ao prometido nas amostras",
    problem4: "Fornecedor não responde mais após receber o dinheiro",
    problem5: "Perdeu todo o investimento sem recurso",
    withYuanBR: "Com YuanBR",
    solution1: "Pagamento retido até você confirmar a entrega",
    solution2: "Produto diferente? Seu dinheiro de volta",
    solution3: "Qualidade garantida ou reembolso total",
    solution4: "Fornecedor só recebe após você aprovar",
    solution5: "Proteção total do início ao fim",
    securePaymentBadge: "Sistema de Pagamento Seguro",
    escrowTitle: "Seu dinheiro protegido até a entrega",
    escrowSubtitle: "Funciona como um cofre: o dinheiro fica bloqueado e só é liberado quando você confirmar que está tudo certo",
    step1Title: "Você Paga",
    step1Desc: "Seu dinheiro fica retido em segurança na YuanBR",
    step2Title: "Fornecedor Envia",
    step2Desc: "O fornecedor sabe que receberá e envia seu pedido",
    step3Title: "Você Confirma",
    step3Desc: "Produto OK? Liberamos o pagamento. Problema? Devolvemos seu dinheiro",
    wantProtection: "Quero Esta Proteção",
    featuresTitle: "Mais que conversão de moeda",
    featuresSubtitle: "Uma plataforma completa para suas importações",
    feature1Title: "Proteção Total",
    feature1Desc: "Seu dinheiro só é liberado após confirmação de entrega",
    feature2Title: "Conversão Instantânea",
    feature2Desc: "Cotação em tempo real BRL → CNY com as melhores taxas",
    feature3Title: "Rastreamento Completo",
    feature3Desc: "Acompanhe cada etapa da sua transação em tempo real",
    benefitsTitle: "Por que escolher YuanBR?",
    benefit1: "Proteção completa em todas as transações",
    benefit2: "Taxas de conversão competitivas",
    benefit3: "Suporte em português e chinês",
    benefit4: "Plataforma 100% segura e regulamentada",
    benefit5: "Sem taxas escondidas ou surpresas",
    benefit6: "Resolução rápida de disputas",
    testimonialsTitle: "O que dizem nossos clientes",
    testimonial1Text: "Perdi R$ 50 mil com um fornecedor que sumiu. Com a YuanBR isso nunca mais aconteceu. Meu dinheiro só é liberado quando eu confirmo que está tudo certo.",
    testimonial1Author: "Carlos Silva",
    testimonial1Company: "Importador, São Paulo",
    testimonial2Text: "Fiz 15 transações este ano, todas com segurança total. A plataforma é fácil de usar e o suporte responde rápido.",
    testimonial2Author: "Ana Santos",
    testimonial2Company: "Empresária, Rio de Janeiro",
    testimonial3Text: "Como fornecedor, gosto que meus clientes confiem em mim. A YuanBR facilita isso e recebo meus pagamentos com garantia.",
    testimonial3Author: "Wei Zhang",
    testimonial3Company: "Fornecedor, Guangzhou",
    ctaTitle: "Pare de arriscar seu dinheiro",
    ctaSubtitle: "Junte-se a centenas de empresários que já importam com segurança",
    startNow: "Começar Agora",
    learnMore: "Saiba Mais",
    footerTagline: "Importações seguras entre Brasil e China",
    footerRights: "2024 YuanBR. Todos os direitos reservados.",
    footerProduct: "Produto",
    footerCompany: "Empresa",
    footerSupport: "Suporte",
    howItWorks: "Como Funciona",
    pricing: "Preços",
    faq: "FAQ",
    about: "Sobre Nós",
    contact: "Contato",
    blog: "Blog",
    help: "Central de Ajuda",
    terms: "Termos de Uso",
    privacy: "Privacidade"
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
    heroDescriptionBold: "产品送达或退款。就这么简单。",
    protectPayments: "保护我的付款",
    seeHowItWorks: "了解运作方式",
    problemTitle: "您是否遇到过这些问题？",
    problemSubtitle: "每天都有成千上万的巴西企业家在与中国供应商交易时面临风险",
    withoutProtection: "没有保护",
    problem1: "提前付款后供应商失联",
    problem2: "收到的产品与约定完全不符",
    problem3: "质量低于样品承诺",
    problem4: "供应商收款后不再回复",
    problem5: "失去全部投资无法追回",
    withYuanBR: "使用 YuanBR",
    solution1: "付款保留直到您确认收货",
    solution2: "产品不符？全额退款",
    solution3: "质量保证或全额退款",
    solution4: "只有在您批准后供应商才能收款",
    solution5: "从始至终的全面保护",
    securePaymentBadge: "安全支付系统",
    escrowTitle: "您的资金受保护直到交货",
    escrowSubtitle: "就像保险箱一样：资金被锁定，只有在您确认一切正常后才会释放",
    step1Title: "您付款",
    step1Desc: "您的资金安全保管在 YuanBR",
    step2Title: "供应商发货",
    step2Desc: "供应商知道会收到款项并发送您的订单",
    step3Title: "您确认",
    step3Desc: "产品没问题？我们释放付款。有问题？我们退还您的资金",
    wantProtection: "我要这个保护",
    featuresTitle: "不仅仅是货币兑换",
    featuresSubtitle: "为您的进口提供完整平台",
    feature1Title: "全面保护",
    feature1Desc: "只有在确认交货后才会释放您的资金",
    feature2Title: "即时兑换",
    feature2Desc: "实时汇率 BRL → CNY，最优惠的费率",
    feature3Title: "完整追踪",
    feature3Desc: "实时跟踪您交易的每个阶段",
    benefitsTitle: "为什么选择 YuanBR？",
    benefit1: "所有交易的完全保护",
    benefit2: "具有竞争力的兑换率",
    benefit3: "支持葡萄牙语和中文",
    benefit4: "100% 安全且受监管的平台",
    benefit5: "无隐藏费用或意外收费",
    benefit6: "快速解决争议",
    testimonialsTitle: "客户评价",
    testimonial1Text: "我曾因供应商失联损失了 5 万雷亚尔。使用 YuanBR 后再也没发生过。只有在我确认一切正常后才会释放我的资金。",
    testimonial1Author: "卡洛斯·席尔瓦",
    testimonial1Company: "进口商，圣保罗",
    testimonial2Text: "今年我完成了 15 笔交易，全部安全无虞。平台易于使用，客服响应迅速。",
    testimonial2Author: "安娜·桑托斯",
    testimonial2Company: "企业家，里约热内卢",
    testimonial3Text: "作为供应商，我希望客户信任我。YuanBR 使这变得容易，我能有保证地收到付款。",
    testimonial3Author: "张伟",
    testimonial3Company: "供应商，广州",
    ctaTitle: "停止冒险使用您的资金",
    ctaSubtitle: "加入数百位已经安全进口的企业家",
    startNow: "立即开始",
    learnMore: "了解更多",
    footerTagline: "巴西与中国之间的安全进口",
    footerRights: "2024 YuanBR。保留所有权利。",
    footerProduct: "产品",
    footerCompany: "公司",
    footerSupport: "支持",
    howItWorks: "如何运作",
    pricing: "价格",
    faq: "常见问题",
    about: "关于我们",
    contact: "联系方式",
    blog: "博客",
    help: "帮助中心",
    terms: "使用条款",
    privacy: "隐私政策"
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
                  {t.protectPayments}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  {t.seeHowItWorks}
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
              {t.problemTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.problemSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Problemas */}
            <Card className="p-8 border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-destructive" />
                <h3 className="text-2xl font-bold text-destructive">{t.withoutProtection}</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{t.problem1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{t.problem2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{t.problem3}</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{t.problem4}</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{t.problem5}</span>
                </li>
              </ul>
            </Card>

            {/* Solução */}
            <Card className="p-8 border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 hover-scale transition-transform">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-primary">{t.withYuanBR}</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">{t.solution1}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">{t.solution2}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">{t.solution3}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">{t.solution4}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground font-semibold">{t.solution5}</span>
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
                <span className="text-sm font-semibold text-primary">{t.securePaymentBadge}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                {t.escrowTitle}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t.escrowSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center border-2 border-primary/20 hover-scale transition-transform">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t.step1Title}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.step1Desc}
                </p>
              </Card>

              <Card className="p-6 text-center border-2 border-primary/20 hover-scale transition-transform">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t.step2Title}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.step2Desc}
                </p>
              </Card>

              <Card className="p-6 text-center border-2 border-primary/20 hover-scale transition-transform">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t.step3Title}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.step3Desc}
                </p>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" className="bg-[var(--gradient-hero)] hover:opacity-90 transition-opacity text-lg px-12 h-14 hover-scale">
                {t.wantProtection}
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
              {t.featuresTitle}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 text-center hover-scale transition-transform">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t.feature1Title}</h3>
              <p className="text-muted-foreground">
                {t.feature1Desc}
              </p>
            </Card>

            <Card className="p-8 text-center hover-scale transition-transform">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t.feature2Title}</h3>
              <p className="text-muted-foreground">
                {t.feature2Desc}
              </p>
            </Card>

            <Card className="p-8 text-center hover-scale transition-transform">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t.feature3Title}</h3>
              <p className="text-muted-foreground">
                {t.feature3Desc}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12 text-center">
              {t.benefitsTitle}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5, t.benefit6].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-background rounded-lg hover-scale transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t.testimonialsTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <p className="text-muted-foreground mb-6 italic">
                "{t.testimonial1Text}"
              </p>
              <div>
                <p className="font-bold text-foreground">{t.testimonial1Author}</p>
                <p className="text-sm text-muted-foreground">{t.testimonial1Company}</p>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-muted-foreground mb-6 italic">
                "{t.testimonial2Text}"
              </p>
              <div>
                <p className="font-bold text-foreground">{t.testimonial2Author}</p>
                <p className="text-sm text-muted-foreground">{t.testimonial2Company}</p>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-muted-foreground mb-6 italic">
                "{t.testimonial3Text}"
              </p>
              <div>
                <p className="font-bold text-foreground">{t.testimonial3Author}</p>
                <p className="text-sm text-muted-foreground">{t.testimonial3Company}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            {t.ctaTitle}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {t.ctaSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-12 h-14 hover-scale">
              {t.startNow}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12 h-14 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              {t.learnMore}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-foreground">YuanBR</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.footerTagline}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">{t.footerProduct}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t.howItWorks}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.pricing}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.faq}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">{t.footerCompany}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t.about}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.contact}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.blog}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">{t.footerSupport}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">{t.help}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.terms}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t.privacy}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>{t.footerRights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
