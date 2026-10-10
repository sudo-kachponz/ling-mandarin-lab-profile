import { testimonials, Testimonial } from "@/data/testimonials";
import { CalendarDays, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeading from "@/components/SectionHeading";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <figure className="relative flex w-[300px] shrink-0 flex-col rounded-[1.5rem] border border-border/80 bg-card p-6 shadow-soft md:w-[380px]">
    <span aria-hidden className="font-hanzi absolute right-5 top-3 text-5xl leading-none text-maroon/10">「</span>
    <figcaption className="pr-8">
      <p className="font-display text-base font-bold leading-snug text-maroon">{testimonial.categoryTitle}</p>
      {(testimonial.laoshi || testimonial.date) && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {testimonial.laoshi && (
            <span className="flex items-center gap-1 font-semibold">
              <UserRound className="h-3 w-3" />
              {testimonial.laoshi}
            </span>
          )}
          {testimonial.date && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {testimonial.date}
            </span>
          )}
        </div>
      )}
    </figcaption>
    <blockquote className="mt-4 flex-grow whitespace-pre-line text-sm leading-relaxed text-foreground/90">
      "{testimonial.text}"
    </blockquote>
  </figure>
);

const TestimonialsSection = () => {
  const guruTestimonials = testimonials.filter((t) => t.group === "guru");
  const spesialisTestimonials = testimonials.filter((t) => t.group === "spesialis");

  const renderMarquee = (items: Testimonial[]) => {
    const displayItems = items.length < 4 ? [...items, ...items, ...items] : items;

    return (
      <div className="marquee-viewport group relative flex overflow-x-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {[0, 1].map((track) => (
          <div
            key={track}
            aria-hidden={track === 1 ? true : undefined}
            className="marquee-track flex min-w-max animate-marquee items-start gap-5 px-2.5 group-hover:[animation-play-state:paused]"
          >
            {displayItems.map((testimonial, idx) => (
              <TestimonialCard key={`${testimonial.id}-${track}-${idx}`} testimonial={testimonial} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const triggerClass =
    "rounded-full py-2 font-semibold data-[state=active]:bg-maroon data-[state=active]:text-white data-[state=active]:shadow-sm";

  return (
    <section className="section overflow-hidden">
      <Tabs defaultValue="semua" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            char="评"
            title="Kata Mereka tentang Ling Chinese Lab"
            lead="Testimoni dari murid-murid yang telah belajar bersama kami"
            className="mb-10"
          />
          <div className="mb-8 flex justify-center">
            <TabsList className="grid h-auto w-full max-w-md grid-cols-3 rounded-full border border-border bg-card p-1">
              <TabsTrigger value="semua" className={triggerClass}>Semua</TabsTrigger>
              <TabsTrigger value="guru" className={triggerClass}>Tentang Guru</TabsTrigger>
              <TabsTrigger value="spesialis" className={triggerClass}>Spesialis Taiwan</TabsTrigger>
            </TabsList>
          </div>
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
    </section>
  );
};

export default TestimonialsSection;
