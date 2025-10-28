export interface Level {
    id: number;
    eventID: number;
    levelID: number;
    name: string;
    creator: string;
    videoID: string;
    point: number;
    needRaw: boolean;
    totalProgress: number;
    requiredLevel: number | null;
    minEventProgress: number;
}
