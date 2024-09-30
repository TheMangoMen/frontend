export function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

export function stageCountFn(stages: any) {
    return (name: any) => stages.find((s: any) => s.name === name)
}
