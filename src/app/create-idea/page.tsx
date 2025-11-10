"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CategoryBadge } from "@/components/CategoryBadge";
import { categories } from "@/lib/dummyData";
import { Category } from "@/lib/types";

const createIdeaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum([
    "DeFi",
    "AI",
    "SocialFi",
    "DAO",
    "Gaming",
    "NFTs",
    "Infrastructure",
    "Other",
  ] as const),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .positive("Price must be positive"),
  preview: z
    .string()
    .min(1, "Preview is required")
    .refine((text) => {
      const words = text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      return words.length <= 150;
    }, "Preview must be 150 words or less"),
  fullContent: z
    .string()
    .min(1, "Full content is required")
    .refine((text) => {
      const words = text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      return words.length >= 200;
    }, "Full content must be at least 200 words"),
});

type CreateIdeaFormData = z.infer<typeof createIdeaSchema>;

export default function CreateIdeaPage() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateIdeaFormData>({
    resolver: zodResolver(createIdeaSchema),
    defaultValues: {
      category: "DeFi",
      price: 0,
    },
  });

  const preview = watch("preview");
  const fullContent = watch("fullContent");
  const title = watch("title");
  const category = watch("category");
  const price = watch("price");

  const previewWordCount = preview
    ? preview
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length
    : 0;
  const fullContentWordCount = fullContent
    ? fullContent
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length
    : 0;

  const onSubmit = (data: CreateIdeaFormData) => {
    console.log("Idea submitted:", data);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Idea
          </h1>
          <p className="text-muted-foreground">
            Submit your idea for AI verification and NFT minting
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-white border border-lightgray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Idea Title"
                {...register("title")}
                error={errors.title?.message}
                placeholder="Enter a compelling title for your idea"
              />

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="h-10 w-full px-3 rounded-md border border-lightgray bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tan focus-visible:ring-offset-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <Input
                label="Price in USD"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                error={errors.price?.message}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white border border-lightgray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Preview/Summary
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                Preview Text (Max 150 words)
              </label>
              <textarea
                {...register("preview")}
                rows={6}
                className="w-full rounded-md border border-lightgray bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tan focus-visible:ring-offset-2"
                placeholder="This is what buyers see before purchasing. Keep it concise and compelling (max 150 words)."
              />
              <div className="flex items-center justify-between mt-2">
                {errors.preview && (
                  <p className="text-sm text-destructive">
                    {errors.preview.message}
                  </p>
                )}
                <p
                  className={`text-sm ml-auto ${
                    previewWordCount > 150
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {previewWordCount} / 150 words
                </p>
              </div>
            </div>
          </div>

          {/* Full Content Section */}
          <div className="bg-white border border-lightgray rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Full Idea Details
            </h2>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                Full Content (Minimum 200 words)
              </label>
              <textarea
                {...register("fullContent")}
                rows={12}
                className="w-full rounded-md border border-lightgray bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tan focus-visible:ring-offset-2"
                placeholder="This is revealed after purchase. Provide detailed information about your idea (minimum 200 words)."
              />
              <div className="flex items-center justify-between mt-2">
                {errors.fullContent && (
                  <p className="text-sm text-destructive">
                    {errors.fullContent.message}
                  </p>
                )}
                <p
                  className={`text-sm ml-auto ${
                    fullContentWordCount < 200
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {fullContentWordCount} / 200 words (minimum)
                </p>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-lightgray rounded-lg p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Note:</span> Your idea will be
              minted as an NFT after AI verification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-lightgray"
              onClick={() => setShowPreviewModal(true)}
              disabled={!title || !preview}
            >
              Preview Idea
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-tan hover:bg-tan/90 text-white"
            >
              Submit for AI Review
            </Button>
          </div>
        </form>
      </main>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Idea Preview"
      >
        <div className="space-y-4">
          <div>
            <CategoryBadge category={category || "DeFi"} />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {title || "Idea Title"}
          </h3>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <p className="text-sm text-foreground whitespace-pre-line">
              {preview || "Preview text will appear here"}
            </p>
          </div>
          <div className="pt-4 border-t border-lightgray">
            <p className="text-2xl font-bold text-foreground">${price || 0}</p>
            <p className="text-sm text-muted-foreground">USD</p>
          </div>
        </div>
      </Modal>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-tan text-white px-6 py-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium">
            Idea submitted! AI is reviewing your submission...
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
