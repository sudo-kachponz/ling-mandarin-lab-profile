import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { teachers } from "@/data/teachers";
import { Link } from "react-router-dom";
import PandaOnly from "@/assets/logoPandaOnly.png";

const TeachersPreview = () => {
  // If not enough items to animate smoothly, duplicate them
  const displayTeachers = teachers.length < 5 ? [...teachers, ...teachers, ...teachers] : teachers;

  return (
    <section id="teachers-preview" className="py-16 md:py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Kenalan dengan Para Laoshi
          </h2>
          <p className="text-lg text-muted-foreground">
            Mentor berpengalaman dan bersertifikat HSK/TOCFL dari Xin Zhong School, NTCUST, Petra, dan kampus Taiwan lainnya
          </p>
        </div>
      </div>

      {/* Infinite Marquee moving left-to-right (reverse) */}
      <div className="relative flex overflow-x-hidden group py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Track 1 */}
        <div className="flex items-stretch animate-marquee-reverse space-x-6 min-w-max px-3 group-hover:[animation-play-state:paused]">
          {displayTeachers.map((teacher, idx) => (
            <Card
              key={`${teacher.id}-track1-${idx}`}
              className="w-[280px] sm:w-[320px] flex-shrink-0 group border-border hover:border-primary/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 hover:scale-[1.01] flex flex-col justify-between"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden transition-colors group-hover:bg-primary/20 flex-shrink-0">
                    <img
                      src={teacher.photo ?? PandaOnly}
                      alt={teacher.photo ? `Foto ${teacher.name}` : "Panda Logo"}
                      className="size-12 object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground truncate">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{teacher.mandarinName}</p>
                  </div>
                </div>

                <div className="space-y-3 flex-grow flex flex-col justify-end">
                  {teacher.schools?.length ? (
                    <div className="flex flex-col gap-2">
                      {teacher.schools.map((school) => (
                        <div
                          key={school.name}
                          className="flex items-center gap-2 rounded-xl border border-border bg-white/80 px-3 py-1.5 shadow-sm"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted/60 p-1 flex-shrink-0">
                            <img src={school.logo} alt={`${school.name} logo`} className="h-full w-full object-contain" />
                          </div>
                          <span className="text-xs font-semibold text-foreground truncate">{school.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="inline-block self-start px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {teacher.certification}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Track 2 for seamless loop */}
        <div className="flex items-stretch animate-marquee-reverse space-x-6 min-w-max px-3 group-hover:[animation-play-state:paused]" aria-hidden="true">
          {displayTeachers.map((teacher, idx) => (
            <Card
              key={`${teacher.id}-track2-${idx}`}
              className="w-[280px] sm:w-[320px] flex-shrink-0 group border-border hover:border-primary/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 hover:scale-[1.01] flex flex-col justify-between"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden transition-colors group-hover:bg-primary/20 flex-shrink-0">
                    <img
                      src={teacher.photo ?? PandaOnly}
                      alt={teacher.photo ? `Foto ${teacher.name}` : "Panda Logo"}
                      className="size-12 object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground truncate">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{teacher.mandarinName}</p>
                  </div>
                </div>

                <div className="space-y-3 flex-grow flex flex-col justify-end">
                  {teacher.schools?.length ? (
                    <div className="flex flex-col gap-2">
                      {teacher.schools.map((school) => (
                        <div
                          key={school.name}
                          className="flex items-center gap-2 rounded-xl border border-border bg-white/80 px-3 py-1.5 shadow-sm"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted/60 p-1 flex-shrink-0">
                            <img src={school.logo} alt={`${school.name} logo`} className="h-full w-full object-contain" />
                          </div>
                          <span className="text-xs font-semibold text-foreground truncate">{school.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="inline-block self-start px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {teacher.certification}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        {/* CTA */}
        <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Link to="/tentang">
            Lihat Semua Laoshi
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default TeachersPreview;
