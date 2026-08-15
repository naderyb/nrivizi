import Link from "next/link";
import GlassCard from "@/components/ui/glassCard";
import { DOMAINS, getDomainForClasse, Domain, DomainKey } from "@/lib/domains";
import styles from "./domainGrid.module.css";

export default function DomainGrid({ userClasse }: { userClasse: string }) {
  const userDept = getDomainForClasse(userClasse);
  const ordered = orderDomains(userDept);

  return (
    <div className={styles.grid}>
      {ordered.map((domain) => {
        const isOwn = domain.key === userDept;
        return (
          <GlassCard
            key={domain.key}
            accent={domain.accent}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <div className={styles.headerText}>
                <h3 className={styles.title}>{domain.title}</h3>
                {isOwn && <span className={styles.ownBadge}>Ton domaine</span>}
              </div>
            </div>
            <div className={styles.levelList}>
              {domain.levels.map((level) => (
                <Link
                  key={level.code}
                  href={level.href}
                  className={[styles.levelButton, styles[domain.accent]].join(
                    " ",
                  )}
                >
                  {level.label}
                </Link>
              ))}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

/** User's own domain first, then Extra et Divers (relevant to everyone
 * regardless of classe), then the rest in default order. */
function orderDomains(userDept: DomainKey | null): Domain[] {
  const extra = DOMAINS.find((d) => d.key === "extra")!;
  const own = userDept
    ? (DOMAINS.find((d) => d.key === userDept) ?? null)
    : null;
  const rest = DOMAINS.filter((d) => d.key !== "extra" && d.key !== userDept);
  return [own, extra, ...rest].filter(Boolean) as Domain[];
}
