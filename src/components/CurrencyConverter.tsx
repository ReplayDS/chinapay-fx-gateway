import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const CurrencyConverter = () => {
  const [brlAmount, setBrlAmount] = useState<string>("1000");
  const [cnyAmount, setCnyAmount] = useState<string>("0");
  const [isReversed, setIsReversed] = useState(false);
  const FEE_RATE = 0.05; // 5% fee
  const EXCHANGE_RATE = 1.42; // 1 BRL = 1.42 CNY (approximate)

  useEffect(() => {
    if (isReversed) {
      // Converting CNY to BRL
      const cny = parseFloat(cnyAmount) || 0;
      const brl = (cny / EXCHANGE_RATE) * (1 + FEE_RATE);
      setBrlAmount(brl.toFixed(2));
    } else {
      // Converting BRL to CNY
      const brl = parseFloat(brlAmount) || 0;
      const cny = (brl * EXCHANGE_RATE) * (1 - FEE_RATE);
      setCnyAmount(cny.toFixed(2));
    }
  }, [brlAmount, cnyAmount, isReversed]);

  const handleBrlChange = (value: string) => {
    setBrlAmount(value);
    setIsReversed(false);
  };

  const handleCnyChange = (value: string) => {
    setCnyAmount(value);
    setIsReversed(true);
  };

  const swapCurrencies = () => {
    setIsReversed(!isReversed);
    const temp = brlAmount;
    setBrlAmount(cnyAmount);
    setCnyAmount(temp);
  };

  const totalBrl = parseFloat(brlAmount) || 0;
  const fee = totalBrl * FEE_RATE;

  return (
    <Card className="p-8 backdrop-blur-sm bg-card/95 shadow-[var(--shadow-card)] border-2 border-primary/10">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="brl" className="text-lg font-semibold text-foreground">
            Real Brasileiro (BRL)
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
              R$
            </span>
            <Input
              id="brl"
              type="number"
              value={brlAmount}
              onChange={(e) => handleBrlChange(e.target.value)}
              className="pl-12 text-xl h-14 bg-background border-2 border-border focus:border-primary"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={swapCurrencies}
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 border-2 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cny" className="text-lg font-semibold text-foreground">
            Yuan Chinês (CNY)
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
              ¥
            </span>
            <Input
              id="cny"
              type="number"
              value={cnyAmount}
              onChange={(e) => handleCnyChange(e.target.value)}
              className="pl-12 text-xl h-14 bg-background border-2 border-border focus:border-primary"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="pt-4 border-t-2 border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de câmbio</span>
            <span className="font-semibold text-foreground">1 BRL = {EXCHANGE_RATE} CNY</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de serviço (5%)</span>
            <span className="font-semibold text-secondary">R$ {fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2">
            <span className="text-foreground">Você receberá</span>
            <span className="text-primary text-xl">¥ {cnyAmount}</span>
          </div>
        </div>

        <Button className="w-full h-14 text-lg font-semibold bg-[var(--gradient-hero)] hover:opacity-90 transition-opacity">
          Iniciar Transferência
        </Button>
      </div>
    </Card>
  );
};

export default CurrencyConverter;
