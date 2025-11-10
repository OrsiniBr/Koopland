export type Category =
  | "DeFi"
  | "AI"
  | "SocialFi"
  | "DAO"
  | "Gaming"
  | "NFTs"
  | "Infrastructure"
  | "Other";

export type IdeaStatus = "live" | "pending" | "rejected";

export interface AIRating {
  originality: number;
  useCaseValue: number;
  categoryMatch: number;
}

export interface Idea {
  id: string;
  title: string;
  category: Category;
  preview: string;
  fullContent: string;
  price: number;
  sellerId: string;
  sellerName: string;
  sellerTwitter: string;
  sellerIdeasSold: number;
  salesCount: number;
  aiRating: AIRating;
  createdAt: string;
  status: IdeaStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  twitterUrl: string;
  createdAt: string;
}
