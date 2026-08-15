export type Dept = "info" | "marketing" | "finance";

export const CLASSES: { value: string; label: string; dept: Dept }[] = [
  { value: "LMK1", label: "1e année Licence Marketing", dept: "marketing" },
  { value: "LMK2", label: "2e année Licence Marketing", dept: "marketing" },
  { value: "LMK3", label: "3e année Licence Marketing", dept: "marketing" },
  { value: "LMI1", label: "1e année Licence Métiers de l'Informatique", dept: "info", },
  { value: "LMI2", label: "2e année Licence Métiers de l'Informatique", dept: "info", },
  { value: "LMI3", label: "3e année Licence Métiers de l'Informatique", dept: "info", },
  { value: "LCF1", label: "1e année Licence Comptabilité & Finance", dept: "finance", },
  { value: "LCF2", label: "2e année Licence Comptabilité & Finance", dept: "finance", },
];

export function getClasseInfo(classe: string) {
  return CLASSES.find((c) => c.value === classe) ?? null;
}