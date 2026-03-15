import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ChangelogChange {
  description: string;
}

interface ChangelogGroup {
  title: string;
  icon: LucideIcon;
  changes: ChangelogChange[];
}

interface ChangelogItemProps {
  version: string;
  date: string;
  groups: ChangelogGroup[];
}

export function ChangelogItem({ version, date, groups }: ChangelogItemProps) {
  return (
    <div className="relative pb-6 pl-8 last:pb-0">
      {/* Timeline Line */}
      <div className="bg-border absolute top-0 bottom-0 left-0 w-px group-last:bg-transparent" />
      <div className="flex flex-col gap-1">
        <div className="-ml-9.5 flex flex-row items-center gap-5">
          <div className="bg-accent-foreground z-1 size-3 rounded-full border" />
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            {version}{" "}
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              ({date})
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-2">
              {group.changes.map((change, i) => (
                <p
                  key={i}
                  className="text-muted-foreground text-sm leading-relaxed"
                >
                  {change.description}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
