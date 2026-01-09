import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const prizesData = [
  {
    place: "2ème Place",
    amount: "100 000 FCFA",
    color: "text-slate-300",
    order: "md:order-1",
    elevation: "md:mt-8"
  },
  {
    place: "1ère Place",
    amount: "150 000 FCFA",
    color: "text-yellow-400",
    order: "md:order-2",
    elevation: "md:-translate-y-8 scale-110"
  },
  {
    place: "3ème Place",
    amount: "50 000 FCFA",
    color: "text-yellow-600",
    order: "md:order-3",
    elevation: "md:mt-8"
  },
];

const PrizeCard = ({ place, amount, color, elevation }: {place: string, amount: string, color: string, elevation: string}) => (
  <Card className={cn(
    "bg-card/50 border-border/20 text-center transition-transform duration-300 shadow-lg hover:shadow-xl w-full",
    elevation,
    "hover:scale-105"
    )}>
    <CardHeader>
      <div className="mx-auto bg-card p-4 rounded-full border-2 border-primary/20 w-24 h-24 flex items-center justify-center">
        <Trophy className={cn("w-12 h-12", color)} strokeWidth={1.5} />
      </div>
    </CardHeader>
    <CardContent>
      <CardTitle className={cn("font-headline text-2xl", color)}>{place}</CardTitle>
      <p className="text-3xl font-bold mt-2 text-foreground">{amount}</p>
    </CardContent>
  </Card>
);

const PrizesSection = () => {
  return (
    <section id="prizes" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold">
            Des Prix à Gagner
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            La compétition sera rude, mais les récompenses en valent la peine.
            Voici ce que les meilleures équipes remporteront.
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {prizesData.map((prize) => (
                <div key={prize.place} className={cn("flex justify-center", prize.order)}>
                    <PrizeCard
                        place={prize.place}
                        amount={prize.amount}
                        color={prize.color}
                        elevation={prize.elevation}
                    />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PrizesSection;
