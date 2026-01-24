import { IDEA_NFT_ABI } from "../hooks/abi";
import React, { useCallback } from "react";
import { toast } from "sonner";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useWriteContract,
} from "wagmi";

export const useMint = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  return useCallback(
    async (title: string, imageIPFS: string) => {
      if (!address || !walletClient) {
        toast.error("Not Connected", {
          description: "please connect wallet",
        });
        return;
      }

      const contractAddress = process.env.NEXT_PUBLIC_IDEA_NFT_ADDRESS;

      if (!contractAddress) {
        toast.error("Contract address not set");
        return;
      }

      if (!publicClient) {
        toast.error("Public client not available");
        return;
      }

      try {
        toast.info("Minting NFT...", {
          description: "Please confirm the transaction in your wallet",
        });

        // Mint NFT
        const mintTxHash = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: IDEA_NFT_ABI,
          functionName: "mint",
          args: [title, imageIPFS],
        });

        console.log("Mint txHash: ", mintTxHash);

        toast.info("Transaction submitted", {
          description: "Waiting for confirmation...",
        });

        // Wait for transaction receipt
        const mintReceipt = await publicClient.waitForTransactionReceipt({
          hash: mintTxHash,
        });

        if (mintReceipt.status === "success") {
          toast.success("NFT minted successfully!", {
            description:
              "Your idea NFT has been created and minted to your wallet",
          });
          return mintReceipt;
        } else {
          toast.error("Minting failed", {
            description: "Transaction was not successful",
          });
          throw new Error("Transaction failed");
        }
      } catch (error) {
        console.error("Minting error:", error);
        toast.error("Transaction failed", {
          description: "Something went wrong during minting. Please try again.",
        });
        throw error;
      }
    },
    [address, walletClient, publicClient, writeContractAsync]
  );
};
