"use client";

import { useState } from "react";
import { use } from "react";
import { ExternalLink, Check, Download } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryBadge } from "@/components/CategoryBadge";
import { RatingDisplay } from "@/components/RatingDisplay";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { dummyIdeas } from "@/lib/dummyData";
import { Idea } from "@/lib/types";

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = use(params);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [isPurchased, setIsPurchased] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const idea = dummyIdeas.find((i) => i.id === id);

  if (!idea) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Idea Not Found
            </h1>
            <Link href="/marketplace">
              <Button className="bg-tan hover:bg-tan/90 text-white">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    console.log("Processing payment via SideShift with", selectedToken);
    // Mock purchase flow
    setTimeout(() => {
      setIsPurchased(true);
      setShowFullContent(true);
      setShowPurchaseModal(false);
    }, 2000);
  };

  const paymentTokens = ["BTC", "ETH", "USDC", "MATIC", "SOL", "AVAX"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  {idea.categories.map((cat) => (
                    <CategoryBadge key={cat} category={cat} />
                  ))}
                </div>
                <div className="flex items-center gap-1 bg-tan text-white px-2 py-0.5 rounded-full text-xs">
                  <Check className="h-3 w-3" />
                  <span>AI Verified</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-6">
                {idea.title}
              </h1>
            </div>

            {/* Seller Info Card */}
            <div className="bg-white border border-lightgray rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Seller Information
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-lightgray flex items-center justify-center">
                  <span className="text-lg font-semibold text-foreground">
                    {idea.sellerName[0]}
                  </span>
                </div>
                <div className="grow">
                  <p className="font-semibold text-foreground">
                    {idea.sellerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {idea.sellerIdeasSold} Ideas Sold
                  </p>
                </div>
                <a
                  href={idea.sellerTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tan hover:text-tan/80"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Price and Purchase */}
            <div className="bg-white border border-lightgray rounded-lg p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-4xl font-bold text-foreground">
                  ${idea.price}
                </p>
                <p className="text-sm text-muted-foreground">USD</p>
              </div>
              <Button
                onClick={handlePurchase}
                className="w-full bg-tan hover:bg-tan/90 text-white"
                disabled={isPurchased}
              >
                {isPurchased ? "Already Purchased" : "Buy Idea NFT"}
              </Button>
              {!isPurchased && (
                <p className="mt-3 text-sm text-muted-foreground text-center">
                  Pay with any crypto via{" "}
                  <span className="font-semibold">SideShift</span>
                </p>
              )}
            </div>

            {/* AI Rating Card */}
            <div className="bg-white border border-lightgray rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                AI Verification Report
              </h2>
              <div className="space-y-4">
                <RatingDisplay
                  label="Originality & Innovation"
                  value={idea.aiRating.originality}
                />
                <RatingDisplay
                  label="Use Case Relevance"
                  value={idea.aiRating.useCaseValue}
                />
                <RatingDisplay
                  label="Category Match"
                  value={idea.aiRating.categoryMatch}
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Analyzed by OpenAI GPT-4
              </p>
            </div>

            {/* Purchase Info */}
            {!isPurchased && (
              <div className="bg-lightgray rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Supported Payment Tokens
                </h3>
                <div className="flex flex-wrap gap-2">
                  {paymentTokens.map((token) => (
                    <span
                      key={token}
                      className="px-3 py-1 bg-white rounded-full text-sm text-foreground"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-lightgray rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Preview
              </h2>
              <p className="text-sm text-muted-foreground mb-6 whitespace-pre-line">
                {idea.preview}
              </p>

              {!isPurchased && (
                <>
                  <div className="border-t border-lightgray my-6"></div>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Full idea details revealed after purchase and NFT minting
                  </p>
                </>
              )}

              {showFullContent && (
                <>
                  <div className="border-t border-lightgray my-6"></div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Full Idea Details
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                    {idea.fullContent}
                  </p>
                  <Button variant="outline" className="w-full border-lightgray">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-lightgray">
                <p className="text-sm text-muted-foreground text-center">
                  {idea.salesCount} people have bought this idea
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Select Payment Token"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose your payment token. Payment will be processed via{" "}
            <span className="font-semibold">SideShift</span>.
          </p>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-lightgray bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tan focus-visible:ring-offset-2"
          >
            {paymentTokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-lightgray"
              onClick={() => setShowPurchaseModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-tan hover:bg-tan/90 text-white"
              onClick={handleConfirmPurchase}
            >
              Proceed with SideShift
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Message */}
      {isPurchased && !showPurchaseModal && (
        <div className="fixed bottom-4 right-4 bg-tan text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">
            Processing payment via SideShift... NFT will be minted to your
            wallet
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
