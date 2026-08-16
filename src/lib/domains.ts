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
      {
        code: "LMI1",
        label: "LMI1",
        href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/Ej7z3cFUlQxHsHMFcTfPDC8BQKQhfbrKatwOnjlqH8W2ng?e=wozqx4",
      },
      {
        code: "LMI2",
        label: "LMI2",
        href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/Em4TQW_J6y5HuR_fS1wnffoBFz_5Q_XHRY24Y54Zk7oSQw?e=lxsb1t",
      },
      // { code: "LMI3", label: "LMI3", href: "#" },
    ],
  },
  {
    key: "commerciale",
    title: "Licence Marketing",
    accent: "marketing",
    levels: [
      {
        code: "LMK1",
        label: "LMK1",
        href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/EhuySCHiiqNLtkuBxGswF7sBUQG9-jiQVJBJoM4KZWGg6Q?e=tR26VO",
      },
      {
        code: "LMK2",
        label: "LMK2",
        href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/ElE6px4MYJdCkUrtIMCtXEgB8OZRWVbaDrRtMHIC7KkvhQ?e=Vvg9GQ",
      },
      {
        code: "LMK3",
        label: "LMK3",
        href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/EjHDE50qHRZKmuyOq27eSAcBpTZ0E1vFdnAqiyZvwRcTRQ?e=FVs5u7",
      },
    ],
  },
  {
    key: "finance",
    title: "Licence Comptabilité et Finance",
    accent: "finance",
    levels: [
      {
        code: "LCF1",
        label: "LCF1",
        href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/EimXHyOky1tOkihLF4dl89QBijqrkmdw1MWrdqdIrahiKA?e=td5Udh",
      },
      // { code: "LCF2", label: "LCF2", href: "#" },
    ],
  },
  {
    key: "extra",
    title: "Extra et Divers",
    accent: "extra",
    levels: [
      {
        code: "livre",
        label: "Livre",
        href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/El9M2AgtmydEqlZhbjLNqLcBO4z7INvPJ_EJpTNH1u19fA?e=HZ0UoE",
      },
    ],
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
