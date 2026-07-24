export interface PlatformEntry {
  platform: string;
  handle: string;
  followers: number | null;
  engagementRate: number | null;
}

export interface AudienceInfo {
  age?: string;
  geo?: string;
  gender?: string;
}

export interface CreatorProfileData {
  niche: string;
  bio: string;
  platforms: PlatformEntry[];
  audience: AudienceInfo;
  tone: string;
  pastDeals: string;
  rateFloor: number | null;
}

export const EMPTY_PROFILE: CreatorProfileData = {
  niche: "",
  bio: "",
  platforms: [],
  audience: {},
  tone: "",
  pastDeals: "",
  rateFloor: null,
};
