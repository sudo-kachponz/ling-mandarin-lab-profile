import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { ExternalLink, MapPin, Award, FileText } from "lucide-react";
import { Teacher } from "@/data/teachers";
import PandaOnly from "@/assets/logoPandaOnly.png";

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <Card className="group border-border hover:border-primary/60 hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.01]">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:bg-primary/20 transition-colors">
            <img
              src={teacher.photo ?? PandaOnly}
              alt={teacher.photo ? `Foto ${teacher.name}` : "Panda Logo"}
              className="size-16 object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{teacher.name}</h3>
            <p className="text-muted-foreground">{teacher.mandarinName}</p>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center space-x-2">
            <Award className="w-4 h-4 text-primary" />
            <span>Pendidikan</span>
          </h4>
          {teacher.schools?.length ? (
            <div className="flex flex-col gap-2">
              {teacher.schools.map((school) => (
                <div
                  key={school.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted/60 p-1.5">
                    <img src={school.logo} alt={`${school.name} logo`} className="h-full w-full object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{school.name}</span>
                </div>
              ))}
            </div>
          ) : null}

        </div>

        {/* Certification */}
        <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg">
          {teacher.certification}
        </div>

        {/* Certificate */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">Dokumen Sertifikat</h4>
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
                        className="block group/cert overflow-hidden rounded-xl border border-border bg-muted/30 hover:border-primary/60 transition-all hover:shadow-md"
                      >
                        {previewImage ? (
                          <div className="relative aspect-video bg-background flex items-center justify-center">
                            <img
                              src={previewImage}
                              alt={`Sertifikat ${certificate.label}`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover/cert:scale-105"
                            />
                            {certificate.type === "pdf" ? (
                              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                                PDF
                              </span>
                            ) : null}
                          </div>
                        ) : certificate.type === "pdf" ? (
                          <div className="relative aspect-video bg-background">
                            <object
                              data={pdfViewerSrc ?? certificate.file}
                              type="application/pdf"
                              className="h-full w-full"
                            >
                              <div className="h-full w-full flex flex-col items-center justify-center text-primary space-y-2">
                                <FileText className="w-8 h-8" />
                                <p className="text-sm font-semibold text-foreground">Dokumen PDF</p>
                              </div>
                            </object>
                            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                              PDF
                            </span>
                          </div>
                        ) : (
                          <div className="aspect-video bg-background flex flex-col items-center justify-center text-primary space-y-2">
                            <FileText className="w-8 h-8" />
                            <p className="text-sm font-semibold text-foreground">Dokumen PDF</p>
                          </div>
                        )}
                        <div className="px-4 py-3 flex items-center justify-between text-sm font-semibold text-foreground bg-background">
                          <span className="mr-2 line-clamp-1">{certificate.label}</span>
                          <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                        </div>
                      </a>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-2 border-2" />
              <CarouselNext className="hidden md:flex right-2 border-2" />
            </Carousel>
          ) : (
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
              Sertifikat sedang diproses
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCard;
