export type DomainKey = "informatique" | "commerciale" | "finance" | "extra";
export type Accent = "info" | "marketing" | "finance" | "extra";

export interface DomainLevel {
  code: string;
  label: string;
  href: string;
}

export interface Domain {
  key: DomainKey;
  title: string;
  accent: Accent;
  levels: DomainLevel[];
}

export const DOMAINS: Domain[] = [
  {
    key: "informatique",
    title: "Licence Métiers de l'Informatique",
    accent: "info",
    levels: [
      { code: "LMI1", label: "LMI1", href: "#" },
      { code: "LMI2", label: "LMI2", href: "#" },
      { code: "LMI3", label: "LMI3", href: "#" },
    ],
  },
  {
    key: "commerciale",
    title: "Licence Marketing",
    accent: "marketing",
    levels: [
      { code: "LMK1", label: "LMK1", href: "#" },
      { code: "LMK2", label: "LMK2", href: "#" },
      { code: "LMK3", label: "LMK3", href: "#" },
    ],
  },
  {
    key: "finance",
    title: "Licence Comptabilité et Finance",
    accent: "finance",
    levels: [
      { code: "LCF1", label: "LCF1", href: "#" },
      { code: "LCF2", label: "LCF2", href: "#" },
    ],
  },
  {
    key: "extra",
    title: "Extra et Divers",
    accent: "extra",
    levels: [{ code: "livre", label: "Livre", href: "#" }],
  },
];

/** Maps a student's classe (e.g. "LMI2") to its parent domain, so we can
 * highlight their own domain on the dashboard grid. */
export function getDomainForClasse(classe: string): DomainKey | null {
  if (classe.startsWith("LMI")) return "informatique";
  if (classe.startsWith("LMK")) return "commerciale";
  if (classe.startsWith("LCF")) return "finance";
  return null;
}
