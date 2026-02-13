import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Entry {
    id: bigint;
    title: string;
    body: string;
    published: boolean;
    createdAt: bigint;
    tags: Array<string>;
    section: Section;
    updatedAt: bigint;
    excerpt?: string;
}
export interface Work {
    id: bigint;
    title: string;
    file: ExternalBlob;
    published: boolean;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
}
export interface UserProfile {
    name: string;
}
export enum Section {
    research = "research",
    poetry = "poetry",
    storytelling = "storytelling"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEntry(section: Section, title: string, body: string, tags: Array<string>, excerpt: string | null): Promise<Entry>;
    createWork(title: string, description: string, file: ExternalBlob): Promise<Work>;
    deleteEntry(id: bigint): Promise<void>;
    deleteWork(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEntry(id: bigint): Promise<Entry>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWork(id: bigint): Promise<Work>;
    isCallerAdmin(): Promise<boolean>;
    listAllEntries(): Promise<Array<Entry>>;
    listAllWorks(): Promise<Array<Work>>;
    listPublishedBySection(section: Section): Promise<Array<Entry>>;
    listPublishedWorks(): Promise<Array<Work>>;
    listRecentEntries(limit: bigint): Promise<Array<Entry>>;
    listRecentWorks(limit: bigint): Promise<Array<Work>>;
    publishEntry(id: bigint, published: boolean): Promise<void>;
    publishWork(id: bigint, published: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchEntries(searchTerm: string): Promise<Array<Entry>>;
    searchEntriesByTag(tag: string): Promise<Array<Entry>>;
    searchWorks(searchTerm: string): Promise<Array<Work>>;
    updateEntry(id: bigint, section: Section, title: string, body: string, tags: Array<string>, excerpt: string | null): Promise<Entry>;
    updateWork(id: bigint, title: string, description: string): Promise<Work>;
}
