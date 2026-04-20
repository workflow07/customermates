"use client";

import { Fragment } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AppImage } from "@/components/shared/app-image";

export type ComparisonFeature = {
  competitor: string | boolean;
  competitor2?: string | boolean;
  name: string;
  source: string | boolean;
};

export type ComparisonSection = {
  features: ComparisonFeature[];
  title: string;
};

export type ComparisonTableProps = {
  competitor2Name?: string;
  competitorName: string;
  sections: ComparisonSection[];
  title: string;
};

function ComparisonCell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center justify-center px-6">
        {value ? (
          <CheckIcon className={cn("mx-auto size-5", "text-primary dark:text-primary")} />
        ) : (
          <XIcon className="mx-auto size-5 text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-6">
      <span className="text-x-sm block text-center">{value}</span>
    </div>
  );
}

export function ComparisonTable({ competitor2Name, competitorName, sections, title }: ComparisonTableProps) {
  const hasTwoCompetitors = Boolean(competitor2Name);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 pt-4">
      <div className="mb-8">
        <h2 className="text-x-3xl mb-6 text-left">{title}</h2>
      </div>

      <div className="mx-auto max-w-7xl overflow-x-auto">
        <div className="min-w-[500px] overflow-hidden rounded-xl bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead className="px-6" />

                <TableHead className="px-6 text-center align-middle">
                  <div className="flex flex-col items-center justify-center py-2">
                    <AppImage alt="Customermates" height={27} src="customermates.svg" width={150} />
                  </div>
                </TableHead>

                <TableHead className="px-6 text-center align-middle">
                  <span className="text-x-lg block text-center">{competitorName}</span>
                </TableHead>

                {hasTwoCompetitors ? (
                  <TableHead className="px-6 text-center align-middle">
                    <span className="text-x-lg block text-center">{competitor2Name}</span>
                  </TableHead>
                ) : null}
              </TableRow>
            </TableHeader>

            <TableBody>
              {sections.map((section, sectionIndex) => (
                <Fragment key={`section-${sectionIndex}`}>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableCell className="px-6 py-3">
                      <h3 className="text-x-md">{section.title}</h3>
                    </TableCell>

                    <TableCell className="py-3" />

                    <TableCell className="py-3" />

                    {hasTwoCompetitors ? <TableCell className="py-3" /> : null}
                  </TableRow>

                  {section.features.map((feature, featureIndex) => (
                    <TableRow
                      key={`${sectionIndex}-${featureIndex}`}
                      className="transition-colors last:border-b-0 hover:bg-muted/30"
                    >
                      <TableCell className="px-6 py-3 align-middle">
                        <span className="text-x-sm text-subdued">{feature.name}</span>
                      </TableCell>

                      <TableCell className="py-3 align-middle">
                        <ComparisonCell value={feature.source} />
                      </TableCell>

                      <TableCell className="py-3 align-middle">
                        <ComparisonCell value={feature.competitor} />
                      </TableCell>

                      {hasTwoCompetitors ? (
                        <TableCell className="py-3 align-middle">
                          <ComparisonCell value={feature.competitor2 ?? ""} />
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
