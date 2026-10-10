import { ArrowRight } from "lucide-react";
import { teachers, Teacher } from "@/data/teachers";
import { Link } from "react-router-dom";
import PandaOnly from "@/assets/logoPandaOnly.png";
import SectionHeading from "@/components/SectionHeading";

const TeacherMini = ({ teacher }: { teacher: Teacher }) => (
  <article className="flex w-[272px] shrink-0 flex-col rounded-[1.5rem] border border-border/80 bg-card p-5 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-maroon/30 hover:shadow-lift sm:w-[300px]">
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-maroon/10 ring-offset-2 ring-offset-card">
        <img
          src={teacher.photo ?? PandaOnly}
          alt={teacher.photo ? `Foto ${teacher.name}` : "Panda Logo"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-lg font-bold">{teacher.name}</h3>
        <p className="truncate text-sm text-muted-foreground">{teacher.mandarinName}</p>
      </div>
    </div>

    <div className="mt-4 flex flex-1 flex-col justify-end gap-3">
      {teacher.schools?.length ? (
        <ul className="space-y-1.5">
          {teacher.schools.map((school) => (
            <li key={school.name} className="flex items-center gap-2 rounded-lg bg-paper px-2.5 py-1.5">
              <img src={school.logo} alt="" loading="lazy" className="h-5 w-5 shrink-0 object-contain" />
              <span className="truncate text-xs font-semibold text-foreground">{school.name}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <span className="seal self-start">{teacher.certification}</span>
    </div>
  </article>
);

const TeachersPreview = () => {
  // Gandakan bila terlalu sedikit agar marquee tetap penuh
  const displayTeachers = teachers.length < 5 ? [...teachers, ...teachers, ...teachers] : teachers;

  return (
    <section id="teachers-preview" className="section overflow-hidden bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          char="师"
          title="Kenalan dengan Para Laoshi"
          lead="Mentor berpengalaman dan bersertifikat HSK/TOCFL dari Xin Zhong School, NTCUST, Petra, dan kampus Taiwan lainnya"
          className="mb-12"
        />
      </div>

      <div className="marquee-viewport group relative flex overflow-x-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {[0, 1].map((track) => (
          <div
            key={track}
            aria-hidden={track === 1 ? true : undefined}
            className="marquee-track flex min-w-max animate-marquee-reverse items-stretch gap-5 px-2.5 group-hover:[animation-play-state:paused]"
          >
            {displayTeachers.map((teacher, idx) => (
              <TeacherMini key={`${teacher.id}-t${track}-${idx}`} teacher={teacher} />
            ))}
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-12 px-4 text-center sm:px-6 lg:px-8">
        <Link
          to="/tentang"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-maroon/30 bg-card px-6 font-bold text-maroon transition-colors hover:border-maroon/60 hover:bg-maroon/5"
        >
          Lihat Semua Laoshi
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default TeachersPreview;
