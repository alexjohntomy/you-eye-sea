"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Code, FlaskConical, TrendingUp, Users } from "lucide-react";

export function PresetButtons() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [activePreset, setActivePreset] = useState<string | null>(null);

    const presets = [
        { label: "CS Classes by GPA", href: "/explore?subject=CS&level=all&sort=gpa", icon: Code },
        { label: "BIOS Classes by Drop Rate", href: "/explore?subject=BIOS&level=all&sort=dropRate", icon: FlaskConical },
        { label: "Highest Drop Rate", href: "/explore?subject=all&level=all&sort=dropRate", icon: TrendingUp },
        { label: "Highest Enrollment", href: "/explore?subject=all&level=all&sort=totalStudents", icon: Users },
    ];

    const handlePresetClick = (p: { label: string, href: string }) => {
        setActivePreset(p.label);
        startTransition(() => {
            router.push(p.href);
        });
    };

    return (
        <div className="grid w-[92%] md:max-w-full lg:grid-cols-4 md:w-3/4 gap-2 pb-4 pt-1 animate-in fade-in slide-in-from-bottom-2 fill-mode-both mx-auto">
            {presets.map((p) => (
                <Button
                    key={p.label}
                    variant="outline"
                    onClick={() => handlePresetClick(p)}
                    className="relative py-5 px-3 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground opacity-100 shadow-none font-semibold transition-all duration-300 w-full max-w-full overflow-hidden"
                >
                    <div className="flex items-center justify-center truncate w-full">
                        {isPending && activePreset === p.label ? (
                            <Spinner className="mr-1.5 size-4 shrink-0" />
                        ) : (
                            <p.icon className="mr-1.5 size-4 shrink-0" />
                        )}
                        <span className="truncate">{p.label}</span>
                    </div>
                </Button>
            ))}
        </div>
    );
}
