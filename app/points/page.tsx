"use client";

import { Suspense, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import ConnectWallet from "@/app/components/ConnectWallet";
import BridgeButton from "@/app/components/BridgeButton";
import ShaderBackground from "@/app/components/ShaderBackground";
import PointsDisplay from "@/app/components/points/PointsDisplay";
import TransactionHistory from "@/app/components/points/TransactionHistory";
import LeagueWidget from "@/app/components/points/LeagueWidget";
import TreasuryValueWidget from "@/app/components/points/TreasuryValueWidget";

export default function PointsPage() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <HomeContent />
    </Suspense>
  );

  function HomeContent() {
    return (
      <main className="min-h-screen text-neutral-100 relative">
        <ShaderBackground />

        {/* Top bar (matching main page) */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/img/pulsexpro-white.avif"
                alt="PulseX Pro"
                className="h-8 w-auto"
              />
              <nav className="hidden md:flex items-center gap-3 text-sm text-neutral-400">
                <a href="/" className="px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors">Trade</a>
                <span className="px-2 py-1 rounded-md bg-white/10 text-neutral-100">Points</span>
                <a href="/explorer" className="px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors">Explorer</a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-1 hover:bg-white/5 rounded-md p-1 transition">
                  <img
                    src="/icons/WPLS.avif"
                    alt="PulseChain"
                    className="h-4 w-4"
                  />
                  <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                <div className="absolute top-full left-0 mt-1 bg-black/75 backdrop-blur-xl border border-white/5 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-12">
                  <div className="py-1">
                    <button className="w-full flex items-center justify-center p-2 text-sm text-neutral-300 hover:bg-white/10 transition rounded">
                      <img
                        src="/icons/WPLS.avif"
                        alt="PulseChain"
                        className="h-4 w-4"
                      />
                    </button>
                    <button className="w-full flex items-center justify-center p-2 text-sm text-neutral-300 hover:bg-white/10 transition rounded cursor-not-allowed" disabled>
                      <img
                        src="/icons/eth.avif"
                        alt="Ethereum"
                        className="h-4 w-4 opacity-50"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <BridgeButton />
              <ConnectWallet />
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="mx-auto max-w-[1400px] px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">PulseX Points</h1>
            <p className="text-neutral-400">Earn points by trading through PulseX Fee Wrapper</p>
          </div>

          <div className="space-y-8">
            {/* Main content area */}
            <div className="space-y-6">
              {!isConnected ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
                    <p className="text-neutral-400 mb-6">Connect your wallet to view your trading points and transaction history.</p>
                    <ConnectWallet />
                  </Card>
                </div>
              ) : (
                <>
                  {/* Tab navigation */}
                  <div className="flex justify-center">
                    <div className="flex bg-black/40 border border-white/10 rounded-lg p-1 backdrop-blur-xl">
                      <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-6 py-2 rounded-md transition-all ${
                          activeTab === "overview"
                            ? "bg-white/10 text-white"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveTab("history")}
                        className={`px-6 py-2 rounded-md transition-all ${
                          activeTab === "history"
                            ? "bg-white/10 text-white"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        Transaction History
                      </button>
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="min-h-[400px]">
                    {activeTab === "overview" && <PointsDisplay />}
                    {activeTab === "history" && <TransactionHistory />}
                  </div>
                </>
              )}
            </div>

            {/* Bottom widgets section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* League Widget */}
              <div>
                <LeagueWidget />
              </div>

              {/* Treasury Value Widget */}
              <div>
                <TreasuryValueWidget />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
