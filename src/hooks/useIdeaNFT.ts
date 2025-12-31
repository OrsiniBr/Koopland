import { IDEA_NFT_ABI } from "../../contracts/abi";
import React, { useCallback } from "react";
import { toast } from "sonner";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useWriteContract,
} from "wagmi";

export const useStake = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  return useCallback(
    async (title: string, imageIPFS : string) => {
      if (!address || !walletClient) {
        toast.error("Not Connected", {
          description: "please connect wallet",
        });
        return;
      }

      const contractAddress = process.env.NEXT_IDEA_NFT_ADDRESS;

      if (!contractAddress) {
        toast.error("Contract address not set");
        return;
      }

      if (!publicClient) {
        toast.error("Public client not available");
        return;
      }

      try {

        // Stake tokens
        const mintNFTHash = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: IDEA_NFT_ABI,
          functionName: "mint",
          args: [title, imageIPFS],
        });

        console.log("Stake txHash: ", mintNFTHash);

        // Wait for stake transaction
        const mintNFTHashReciept = await publicClient.waitForTransactionReceipt({
          hash: mintNFTHash,
        });

        if (mintNFTHashReciept.status === "success") {
          toast.success("minting successful", {
            description: "You have successfully minted your Idea NFT",
          });
        } else {
          toast.error("minting failed", {
            description: "minting transaction failed",
          });
        }
      } catch (error) {
        console.error("minting error:", error);
        toast.error("Transaction failed", {
          description: "Something went wrong during minting",
        });
      }
    },
    [address, walletClient, publicClient, writeContractAsync]
  );
};
