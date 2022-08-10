export const portionByType = (
    fileCountsByType: { [key: string]: number; },
    fileCount: number
) => Object.entries(fileCountsByType).reduce((acc, [type, count]) => {
    acc[type] = count / fileCount;
    return acc;
}, {} as { [key: string]: number; });
