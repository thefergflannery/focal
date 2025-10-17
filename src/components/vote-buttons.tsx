"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

interface VoteButtonsProps {
  definitionId: string;
  initialVotes: number;
  initialPopularity: number;
}

export function VoteButtons({
  definitionId,
  initialVotes,
  initialPopularity,
}: VoteButtonsProps) {
  const [votes] = useState(initialVotes);
  const [popularity, setPopularity] = useState(initialPopularity);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (isUpvote: boolean) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          definitionId,
          isUpvote,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state based on the vote action
        if (userVote === (isUpvote ? "up" : "down")) {
          // Remove vote
          setUserVote(null);
          setPopularity(isUpvote ? popularity - 1 : popularity + 1);
        } else if (userVote === (isUpvote ? "down" : "up")) {
          // Change vote type
          setUserVote(isUpvote ? "up" : "down");
          setPopularity(isUpvote ? popularity + 2 : popularity - 2);
        } else {
          // New vote
          setUserVote(isUpvote ? "up" : "down");
          setPopularity(isUpvote ? popularity + 1 : popularity - 1);
        }

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Failed to record vote");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={userVote === "up" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote(true)}
        disabled={isLoading}
        className="flex items-center space-x-1"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{votes}</span>
      </Button>

      <Button
        variant={userVote === "down" ? "destructive" : "outline"}
        size="sm"
        onClick={() => handleVote(false)}
        disabled={isLoading}
        className="flex items-center space-x-1"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
}
