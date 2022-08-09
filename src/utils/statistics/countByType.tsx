import { RemoteFiles } from "../../utils/download/downloadZip";

export const countByType = (files: RemoteFiles) => {
    return files.reduce((acc, file) => {
        if (!file.contentType)
            return acc;
        const category = file.contentType.split("/").at(0) || "other";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number; });
};
