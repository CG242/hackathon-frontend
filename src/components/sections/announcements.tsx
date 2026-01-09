'use client';

import { useAnnouncements } from "@/context/announcements-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


const AnnouncementsSection = () => {
  const { announcements } = useAnnouncements();
  
  const publicAnnouncements = announcements.filter(a => a.scope === 'public');
  const sortedAnnouncements = [...publicAnnouncements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedAnnouncements.length === 0) {
    return null;
  }

  return (
    <section id="announcements" className="py-20 md:py-32 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold">
            Annonces Récentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Restez informé des dernières nouvelles et mises à jour du hackathon.
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: sortedAnnouncements.length > 1,
              }}
              className="w-full"
            >
              <CarouselContent>
                {sortedAnnouncements.map((announcement) => (
                  <CarouselItem key={announcement.id} className="md:basis-1/2 lg:basis-1/3">
                     <div className="p-1 h-full">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-start gap-3 text-lg">
                                    <Megaphone className="w-6 h-6 text-primary shrink-0" />
                                    <span>{announcement.title}</span>
                                </CardTitle>
                                <CardDescription>{new Date(announcement.date).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{announcement.content}</p>
                            </CardContent>
                        </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {sortedAnnouncements.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
