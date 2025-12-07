'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending users based on skill sets.
 *
 * - recommendUsers - A function that suggests users based on a recommendation type.
 * - RecommendUsersInput - The input type for the recommendUsers function.
 * - RecommendUsersOutput - The return type for the recommendUsers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { users } from '@/lib/data';
import type { User } from '@/lib/types';

const allUsersList = users.map(u => ({ id: u.id, name: u.name, skillsOffered: u.skillsOffered, skillsNeeded: u.skillsNeeded }));

const RecommendUsersInputSchema = z.object({
  currentUser: z.object({
    skillsOffered: z.array(z.string()),
    skillsNeeded: z.array(z.string()),
  }),
  recommendationType: z.enum([
    "bestMatches",
    "needsMySkills",
    "offersMyNeeds",
  ]),
  allUsers: z.array(z.object({
      id: z.string(),
      name: z.string(),
      skillsOffered: z.array(z.string()),
      skillsNeeded: z.array(z.string()),
  })).describe("A list of all users in the system to choose recommendations from.")
});
export type RecommendUsersInput = z.infer<typeof RecommendUsersInputSchema>;

const RecommendUsersOutputSchema = z.object({
    recommendedUserIds: z.array(z.string()).describe("An array of user IDs that are recommended based on the criteria."),
});
export type RecommendUsersOutput = z.infer<typeof RecommendUsersOutputSchema>;

export async function recommendUsers(input: Pick<RecommendUsersInput, 'currentUser' | 'recommendationType'>): Promise<RecommendUsersOutput> {
    // We inject the full user list here to be sent to the model
    return recommendUsersFlow({
        ...input,
        allUsers: allUsersList,
    });
}

const recommendationPrompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: { schema: RecommendUsersInputSchema },
  output: { schema: RecommendUsersOutputSchema },
  prompt: `You are an expert matchmaker for a skill-swapping platform. Your goal is to recommend users to the current user based on their skills.

Here is the current user's profile:
- Skills they offer: {{currentUser.skillsOffered}}
- Skills they need: {{currentUser.skillsNeeded}}

Here is the list of all available users:
{{#each allUsers}}
- User ID: {{id}}, Name: {{name}}, Offers: {{skillsOffered}}, Needs: {{skillsNeeded}}
{{/each}}

Based on the recommendation type "{{recommendationType}}", return a list of the most relevant user IDs.

- If "bestMatches", find users who offer skills the current user needs AND need skills the current user offers. This is the highest quality match.
- If "needsMySkills", find users who need skills that the current user offers.
- If "offersMyNeeds", find users who offer skills that the current user needs.

Return ONLY an array of user IDs for the recommended users. Do not include the current user in the recommendations.
`,
});

const recommendUsersFlow = ai.defineFlow(
  {
    name: 'recommendUsersFlow',
    inputSchema: RecommendUsersInputSchema,
    outputSchema: RecommendUsersOutputSchema,
  },
  async (input) => {
    const { output } = await recommendationPrompt(input);
    return output || { recommendedUserIds: [] };
  }
);
