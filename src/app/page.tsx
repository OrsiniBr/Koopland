import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Coins, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { stats } from "@/lib/dummyData";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Welcome to <span className="text-tan">Koopland</span>
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-6">
              Discover AI-Vetted Ideas, Buy with Any Token
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Every idea is rated by AI for originality and value. Buy
              seamlessly using any cryptocurrency - the direct-to-wallet crypto
              exchange.
            </p>
            <Link href="/marketplace">
              <Button
                size="lg"
                className="bg-tan hover:bg-tan/90 text-white text-lg px-8 py-6"
              >
                Explore Ideas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why Choose Koopland?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tan mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  AI-Verified Quality
                </h3>
                <p className="text-muted-foreground">
                  Every idea is analyzed by advanced AI to ensure originality,
                  value, and market fit before listing.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tan mb-4">
                  <Coins className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Cross-Chain Payments
                </h3>
                <p className="text-muted-foreground">
                  Pay with any cryptocurrency through{" "}
                  <span className="font-semibold">SideShift</span>, supporting
                  BTC, ETH, USDC, and more.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tan mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  NFT Ownership
                </h3>
                <p className="text-muted-foreground">
                  Each purchased idea is minted as an NFT, giving you verifiable
                  ownership and the ability to resell.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-lightgray">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-tan mb-2">
                  {stats.totalIdeas}
                </div>
                <div className="text-muted-foreground">Total Ideas Listed</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-tan mb-2">
                  {stats.totalSales}
                </div>
                <div className="text-muted-foreground">Total Sales</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <div className="text-4xl font-bold text-tan mb-2">
                  {stats.activeSellers}
                </div>
                <div className="text-muted-foreground">Active Sellers</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
