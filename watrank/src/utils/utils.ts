/**
 * An em dash, for a contribution whose date we genuinely do not have. Not "Invalid Date", and
 * emphatically not a fabricated date -- see the guard in ExpandableInterviewRow.parseContribution.
 */
export const NO_DATE = "\u2014";

export function formatDate(date: Date | null | undefined) {
    if (!date || Number.isNaN(date.getTime())) return NO_DATE;
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export function stageCountFn(stages: any) {
    return (name: any) => stages.find((s: any) => s.name === name);
}
