export async function uploadToPinata(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const secretKey = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

  if (!apiKey || !secretKey) {
    throw new Error("Pinata API keys not configured");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload to Pinata");
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
}

export function getPinataUrl(ipfsHash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}
