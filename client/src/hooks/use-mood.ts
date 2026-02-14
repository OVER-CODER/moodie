import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Define schema locally if import fails or for stricter client-side validation
// Ideally this matches @shared/schema exactly
export interface MoodResponse {
  mood: string;
  confidence: number;
  recommendations: {
    outfit: string[];
    playlist: string;
    workout: string;
    food: string;
    affirmation: string;
    productivity: string;
  };
}

export function useAnalyzeMood() {
  return useMutation({
    mutationFn: async (data: { method: 'face' | 'self'; data?: string }) => {
      const res = await fetch(api.mood.analyze.path, {
        method: api.mood.analyze.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error('Failed to analyze mood');
      }
      
      return (await res.json()) as MoodResponse;
    },
  });
}

export function useMoodHistory() {
  return useQuery({
    queryKey: [api.mood.history.path],
    queryFn: async () => {
      const res = await fetch(api.mood.history.path);
      if (!res.ok) throw new Error('Failed to fetch history');
      return (await res.json()) as any[]; // Typed generically for now
    },
  });
}
