import { prisma } from "@/lib/db";

export async function voteDefinition(
  userId: string,
  definitionId: string,
  isUpvote: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user already voted on this definition
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_definitionId: {
          userId,
          definitionId,
        },
      },
    });

    const definition = await prisma.definition.findUnique({
      where: { id: definitionId },
      select: { popularity: true, entryId: true },
    });

    if (!definition) {
      return { success: false, message: "Definition not found" };
    }

    if (existingVote) {
      // Update existing vote
      if (existingVote.isUpvote === isUpvote) {
        // Remove vote if clicking the same vote type
        await prisma.$transaction([
          prisma.vote.delete({
            where: { id: existingVote.id },
          }),
          prisma.definition.update({
            where: { id: definitionId },
            data: {
              popularity: isUpvote
                ? definition.popularity - 1
                : definition.popularity + 1,
            },
          }),
          prisma.entry.update({
            where: { id: definition.entryId },
            data: {
              popularity: isUpvote ? { decrement: 1 } : { increment: 1 },
            },
          }),
        ]);
        return { success: true, message: "Vote removed" };
      } else {
        // Change vote type
        await prisma.$transaction([
          prisma.vote.update({
            where: { id: existingVote.id },
            data: { isUpvote },
          }),
          prisma.definition.update({
            where: { id: definitionId },
            data: {
              popularity: isUpvote
                ? definition.popularity + 2
                : definition.popularity - 2,
            },
          }),
          prisma.entry.update({
            where: { id: definition.entryId },
            data: {
              popularity: isUpvote ? { increment: 2 } : { decrement: 2 },
            },
          }),
        ]);
        return { success: true, message: "Vote updated" };
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId,
            definitionId,
            isUpvote,
          },
        }),
        prisma.definition.update({
          where: { id: definitionId },
          data: {
            popularity: isUpvote
              ? definition.popularity + 1
              : definition.popularity - 1,
          },
        }),
        prisma.entry.update({
          where: { id: definition.entryId },
          data: {
            popularity: isUpvote ? { increment: 1 } : { decrement: 1 },
          },
        }),
      ]);
      return { success: true, message: "Vote recorded" };
    }
  } catch (error) {
    console.error("Vote error:", error);
    return { success: false, message: "Failed to record vote" };
  }
}

export async function getUserVote(
  userId: string,
  definitionId: string
): Promise<{ isUpvote: boolean } | null> {
  const vote = await prisma.vote.findUnique({
    where: {
      userId_definitionId: {
        userId,
        definitionId,
      },
    },
  });

  return vote ? { isUpvote: vote.isUpvote } : null;
}
