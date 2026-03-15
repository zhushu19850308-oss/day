import { AIResponse } from "../types";

export async function generateGrowthCard(keyword: string): Promise<AIResponse> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyword }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate card");
  }

  return response.json();
}
