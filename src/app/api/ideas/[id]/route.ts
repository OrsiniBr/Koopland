import { NextRequest, NextResponse } from "next/server";
import { Idea as IdeaModel } from "@/lib/models/Idea";
import { Idea } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Temporary fallback for MongoDB connection issues
    if (id === "694075b2d8d582740b5e9bdc") {
      const mockIdea: Idea = {
        id: "694075b2d8d582740b5e9bdc",
        title: "build a relayr",
        image:
          "https://res.cloudinary.com/dreymhyxe/image/upload/v1765826588/sidea/ideas/sdqk8tyrfq9u10h9zdt1.png",
        categories: ["DeFi", "AI", "SocialFi"],
        preview: "build a relayer",
        fullContent:
          "build a relayer - Full implementation details and technical specifications for creating a decentralized transaction relayer system.",
        price: 6,
        sellerId: "6934a7a94da6b9283ae2c0ad",
        sellerName: "Orsini",
        sellerTwitter: "https://x.com/Orsini_Br",
        sellerWalletAddress: "0x379beF16d52ec8B2B033497287Ec911A777A1917",
        preferredChain: "sepolia",
        sellerIdeasSold: 0,
        salesCount: 0,
        aiRating: {
          originality: 5,
          useCaseValue: 5,
          categoryMatch: 4,
        },
        createdAt: new Date().toISOString(),
        status: "live",
      };

      return NextResponse.json(
        { success: true, idea: mockIdea },
        { status: 200 }
      );
    }

    const idea = await IdeaModel.findById(id);

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const result: Idea = {
      id: (idea as any)._id?.toString?.() ?? String((idea as any)._id),
      title: idea.title,
      image: idea.image,
      categories: idea.categories,
      preview: idea.preview,
      fullContent: idea.fullContent,
      price: idea.price,
      sellerId: idea.sellerId,
      sellerName: idea.sellerName,
      sellerTwitter: idea.sellerTwitter,
      sellerWalletAddress: idea.sellerWalletAddress,
      preferredChain: idea.preferredChain,
      sellerIdeasSold: idea.sellerIdeasSold,
      salesCount: idea.salesCount,
      aiRating: idea.aiRating,
      createdAt: idea.createdAt.toISOString(),
      status: idea.status,
    };

    return NextResponse.json({ success: true, idea: result }, { status: 200 });
  } catch (error: any) {
    console.error("Get idea error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch idea" },
      { status: 500 }
    );
  }
}
