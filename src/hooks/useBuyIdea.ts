import { BUY_IDEA_ABI } from "../../contracts/abi";
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
    async (amount: number) => {
      if (!address || !walletClient) {
        toast.error("Not Connected", {
          description: "please connect wallet",
        });
        return;
      }

      const contractAddress = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;

      if (!contractAddress) {
        toast.error("Contract address not set");
        return;
      }

      if (!publicClient) {
        toast.error("Public client not available");
        return;
      }

      try {
        const amountInWei = BigInt(amount * 10 ** 18);

        // Stake tokens
        const stakeHash = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: contractAbi,
          functionName: "stake",
          args: [amountInWei],
        });

        console.log("Stake txHash: ", stakeHash);

        // Wait for stake transaction
        const stakeReceipt = await publicClient.waitForTransactionReceipt({
          hash: stakeHash,
        });

        if (stakeReceipt.status === "success") {
          toast.success("Staking successful", {
            description: "You have successfully staked your tokens",
          });
        } else {
          toast.error("Staking failed", {
            description: "Staking transaction failed",
          });
        }
      } catch (error) {
        console.error("Staking error:", error);
        toast.error("Transaction failed", {
          description: "Something went wrong during staking",
        });
      }
    },
    [address, walletClient, publicClient, writeContractAsync]
  );
};
