import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { ExternalLink, Award, FileText } from "lucide-react";
import { Teacher } from "@/data/teachers";
import PandaOnly from "@/assets/logoPandaOnly.png";

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-border/80 bg-card shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-maroon/30 hover:shadow-lift">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 pb-5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-secondary ring-2 ring-maroon/10 ring-offset-2 ring-offset-card">
          <img
            src={teacher.photo ?? PandaOnly}
            alt={teacher.photo ? `Foto ${teacher.name}` : "Panda Logo"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold">{teacher.name}</h3>
          <p className="text-sm text-muted-foreground">{teacher.mandarinName}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-6 pb-6">
        {/* Education */}
        <div className="space-y-2.5">
          <h4 className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Award className="h-4 w-4 text-maroon" />
            Pendidikan
          </h4>
          {teacher.schools?.length ? (
            <ul className="space-y-1.5">
              {teacher.schools.map((school) => (
                <li key={school.name} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card p-1.5">
                    <img src={school.logo} alt={`${school.name} logo`} loading="lazy" className="h-full w-full object-contain" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-foreground">{school.name}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Certification */}
        <span className="seal self-start text-[0.8rem]">{teacher.certification}</span>

        {/* Certificate */}
        <div className="mt-auto border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-ink">Dokumen Sertifikat</h4>
            <span className="text-xs text-muted-foreground">
              {teacher.certificates.length ? `${teacher.certificates.length} dokumen` : "Belum tersedia"}
            </span>
          </div>

          {teacher.certificates.length ? (
            <Carousel opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {teacher.certificates.map((certificate, index) => {
                  const previewImage =
                    certificate.type === "image" ? certificate.file : certificate.preview;
                  const pdfViewerSrc =
                    certificate.type === "pdf"
                      ? `${certificate.file}#toolbar=0&navpanes=0&scrollbar=0`
                      : null;

                  return (
                    <CarouselItem key={`${teacher.id}-${index}`} className="md:basis-2/3">
                      <a
                        href={certificate.file}
                        target="_blank"
                        rel="noreferrer"
                        className="group/cert block overflow-hidden rounded-xl border border-border bg-paper transition-colors hover:border-maroon/40"
                      >
                        {previewImage ? (
                          <div className="relative flex aspect-video items-center justify-center bg-paper">
                            <img
                              src={previewImage}
                              alt={`Sertifikat ${certificate.label}`}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover/cert:scale-[1.03]"
                            />
                            {certificate.type === "pdf" ? (
                              <span className="absolute left-2.5 top-2.5 rounded-md bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-white">
                                PDF
                              </span>
                            ) : null}
                          </div>
                        ) : certificate.type === "pdf" ? (
                          <div className="relative aspect-video bg-paper">
                            <object
                              data={pdfViewerSrc ?? certificate.file}
                              type="application/pdf"
                              className="h-full w-full"
                            >
                              <div className="flex h-full w-full flex-col items-center justify-center space-y-2 text-maroon">
                                <FileText className="h-8 w-8" />
                                <p className="text-sm font-semibold text-foreground">Dokumen PDF</p>
                              </div>
                            </object>
                            <span className="absolute left-2.5 top-2.5 rounded-md bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-white">
                              PDF
                            </span>
                          </div>
                        ) : (
                          <div className="flex aspect-video flex-col items-center justify-center space-y-2 bg-paper text-maroon">
                            <FileText className="h-8 w-8" />
                            <p className="text-sm font-semibold text-foreground">Dokumen PDF</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground">
                          <span className="mr-2 line-clamp-1">{certificate.label}</span>
                          <ExternalLink className="h-4 w-4 shrink-0 text-maroon" />
                        </div>
                      </a>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="left-2 hidden border-border bg-card/95 md:flex" />
              <CarouselNext className="right-2 hidden border-border bg-card/95 md:flex" />
            </Carousel>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-paper text-sm text-muted-foreground">
              Sertifikat sedang diproses
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default TeacherCard;
