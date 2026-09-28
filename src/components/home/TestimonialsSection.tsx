import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testimonials, Testimonial } from "@/data/testimonials";
import { Quote, CalendarDays, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TestimonialsSection = () => {
  const guruTestimonials = testimonials.filter((t) => t.group === "guru");
  const spesialisTestimonials = testimonials.filter((t) => t.group === "spesialis");

  const renderMarquee = (items: Testimonial[]) => {
    // If not enough items to animate smoothly, duplicate them so the marquee feels full
    const displayItems = items.length < 4 ? [...items, ...items, ...items] : items;

    return (
      <div className="relative flex overflow-x-hidden group py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Track 1 */}
        <div className="flex animate-marquee space-x-6 min-w-max px-3 group-hover:[animation-play-state:paused]">
          {displayItems.map((testimonial, idx) => (
            <Card key={`${testimonial.id}-1-${idx}`} className="w-[320px] md:w-[400px] flex-shrink-0 border-border bg-card hover:shadow-md transition-shadow flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base font-bold text-primary leading-tight">
                    {testimonial.categoryTitle}
                  </CardTitle>
                  <Quote className="w-5 h-5 text-primary/30 flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  {testimonial.laoshi && (
                    <div className="flex items-center gap-1 font-semibold">
                      <UserRound className="w-3 h-3" />
                      <span>{testimonial.laoshi}</span>
                    </div>
                  )}
                  {testimonial.date && (
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <span>{testimonial.date}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-grow">
                <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed italic">
                  "{testimonial.text}"
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Track 2 for seamless loop */}
        <div className="flex animate-marquee space-x-6 min-w-max px-3 group-hover:[animation-play-state:paused]" aria-hidden="true">
          {displayItems.map((testimonial, idx) => (
            <Card key={`${testimonial.id}-2-${idx}`} className="w-[320px] md:w-[400px] flex-shrink-0 border-border bg-card hover:shadow-md transition-shadow flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base font-bold text-primary leading-tight">
                    {testimonial.categoryTitle}
                  </CardTitle>
                  <Quote className="w-5 h-5 text-primary/30 flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  {testimonial.laoshi && (
                    <div className="flex items-center gap-1 font-semibold">
                      <UserRound className="w-3 h-3" />
                      <span>{testimonial.laoshi}</span>
                    </div>
                  )}
                  {testimonial.date && (
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <span>{testimonial.date}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2 flex-grow">
                <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed italic">
                  "{testimonial.text}"
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Kata Mereka tentang Ling Chinese Lab</h2>
          <p className="text-lg text-muted-foreground">Testimoni dari murid-murid yang telah belajar bersama kami</p>
        </div>

        <Tabs defaultValue="semua" className="w-full mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="guru">Tentang Guru</TabsTrigger>
              <TabsTrigger value="spesialis">Spesialis Taiwan</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="semua" className="mt-0">
            {renderMarquee(testimonials)}
          </TabsContent>
          <TabsContent value="guru" className="mt-0">
            {renderMarquee(guruTestimonials)}
          </TabsContent>
          <TabsContent value="spesialis" className="mt-0">
            {renderMarquee(spesialisTestimonials)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TestimonialsSection;
