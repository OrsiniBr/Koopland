"use client";

import { useState } from "react";
import { ExternalLink, Plus, Download } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryBadge } from "@/components/CategoryBadge";
import { RatingDisplay } from "@/components/RatingDisplay";
import { dummyIdeas } from "@/lib/dummyData";
import { Idea, IdeaStatus } from "@/lib/types";

// Mock user data
const mockUser = {
  id: "user1",
  name: "John Doe",
  email: "john@example.com",
  twitterUrl: "https://twitter.com/johndoe",
};

// Mock user's created ideas (first 5 ideas)
const myIdeas = dummyIdeas.slice(0, 5).map((idea, index) => ({
  ...idea,
  status: (index === 0
    ? "pending"
    : index === 1
    ? "rejected"
    : "live") as IdeaStatus,
}));

// Mock purchased ideas (last 3 ideas)
const purchasedIdeas = dummyIdeas.slice(-3);

export default function ProfilePage() {
  const [expandedIdeas, setExpandedIdeas] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIdeas);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIdeas(newExpanded);
  };

  const stats = {
    totalIdeasListed: myIdeas.length,
    totalSales: myIdeas.reduce((sum, idea) => sum + idea.salesCount, 0),
    totalRevenue: myIdeas.reduce(
      (sum, idea) => sum + idea.price * idea.salesCount,
      0
    ),
    ideasPurchased: purchasedIdeas.length,
  };

  const getStatusBadge = (status: IdeaStatus) => {
    const styles = {
      live: "bg-tan text-white",
      pending: "bg-lightgray text-foreground",
      rejected: "bg-destructive text-white",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status === "live"
          ? "Live"
          : status === "pending"
          ? "Under AI Review"
          : "Rejected"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Stats Card */}
        <div className="bg-white border border-lightgray rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-lightgray flex items-center justify-center">
                <span className="text-2xl font-semibold text-foreground">
                  {mockUser.name[0]}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {mockUser.name}
                </h2>
                <a
                  href={mockUser.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-tan hover:text-tan/80 flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Twitter Profile
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl font-bold text-tan">
                  {stats.totalIdeasListed}
                </p>
                <p className="text-sm text-muted-foreground">Ideas Listed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-tan">
                  ${stats.totalRevenue}
                </p>
                <p className="text-sm text-muted-foreground">Total Sales</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-tan">
                  {stats.totalSales}
                </p>
                <p className="text-sm text-muted-foreground">Units Sold</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-tan">
                  {stats.ideasPurchased}
                </p>
                <p className="text-sm text-muted-foreground">Ideas Purchased</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-ideas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-ideas">My Ideas</TabsTrigger>
            <TabsTrigger value="purchased">Purchased Ideas</TabsTrigger>
          </TabsList>

          {/* My Ideas Tab */}
          <TabsContent value="my-ideas" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                My Created Ideas
              </h3>
              <Link href="/create-idea">
                <Button className="bg-tan hover:bg-tan/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Idea
                </Button>
              </Link>
            </div>

            {myIdeas.length > 0 ? (
              <div className="space-y-4">
                {myIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white border border-lightgray rounded-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <CategoryBadge category={idea.category} />
                          {getStatusBadge(idea.status)}
                        </div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {idea.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {idea.preview}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Price:{" "}
                            </span>
                            <span className="font-semibold text-foreground">
                              ${idea.price}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Sales:{" "}
                            </span>
                            <span className="font-semibold text-foreground">
                              {idea.salesCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">
                              Rating:{" "}
                            </span>
                            <span className="font-semibold text-foreground">
                              {(
                                (idea.aiRating.originality +
                                  idea.aiRating.useCaseValue) /
                                2
                              ).toFixed(1)}
                              /10
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-48">
                        <div className="space-y-2">
                          <RatingDisplay
                            label="Originality"
                            value={idea.aiRating.originality}
                            showProgress={false}
                            className="text-xs"
                          />
                          <RatingDisplay
                            label="Use Case"
                            value={idea.aiRating.useCaseValue}
                            showProgress={false}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-lightgray rounded-lg">
                <p className="text-muted-foreground mb-4">
                  You haven't created any ideas yet
                </p>
                <Link href="/create-idea">
                  <Button className="bg-tan hover:bg-tan/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Idea
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Purchased Ideas Tab */}
          <TabsContent value="purchased" className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Purchased Ideas
            </h3>

            {purchasedIdeas.length > 0 ? (
              <div className="space-y-4">
                {purchasedIdeas.map((idea) => {
                  const isExpanded = expandedIdeas.has(idea.id);
                  return (
                    <div
                      key={idea.id}
                      className="bg-white border border-lightgray rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <CategoryBadge category={idea.category} />
                          </div>
                          <h4 className="text-lg font-semibold text-foreground mb-2">
                            {idea.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {idea.preview}
                          </p>
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-foreground">
                            ${idea.price}
                          </p>
                          <p className="text-xs text-muted-foreground">Paid</p>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-lightgray">
                          <h5 className="font-semibold text-foreground mb-2">
                            Full Idea Details
                          </h5>
                          <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                            {idea.fullContent}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="border-lightgray"
                          onClick={() => toggleExpand(idea.id)}
                        >
                          {isExpanded ? "Show Less" : "Show Full Details"}
                        </Button>
                        <Button variant="outline" className="border-lightgray">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-lightgray rounded-lg">
                <p className="text-muted-foreground">
                  You haven't purchased any ideas yet
                </p>
                <Link href="/marketplace" className="mt-4 inline-block">
                  <Button className="bg-tan hover:bg-tan/90 text-white">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
