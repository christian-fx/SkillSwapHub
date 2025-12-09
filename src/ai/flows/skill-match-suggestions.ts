'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting skill swaps to users based on their listed skills and needs.
 *
 * - suggestSkillSwaps - A function that suggests potential skill swaps based on user skills and needs.
 * - SkillSwapInput - The input type for the suggestSkillSwaps function.
 * - SkillSwapOutput - The return type for the suggestSkillSwaps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { users } from '@/lib/data';

const allUsersList = users.map(u => ({ id: u.id, name: u.name, skillsOffered: u.skillsOffered, skillsNeeded: u.skillsNeeded }));

const SkillSwapInputSchema = z.object({
  currentUser: z.object({
      skillsOffered: z.array(z.string()).describe('List of skills the user offers.'),
      skillsNeeded: z.array(z.string()).describe('List of skills the user needs.'),
  }),
  allUsers: z.array(z.object({
      id: z.string(),
      name: z.string(),
      skillsOffered: z.array(z.string()),
      skillsNeeded: z.array(z.string()),
  })).describe("A list of all users in the system to choose from.")
});
export type SkillSwapInput = z.infer<typeof SkillSwapInputSchema>;

const SkillSwapOutputSchema = z.array(
  z.object({
    suggestedSkill: z.string().describe('A skill offered by another user that matches a skill needed by the current user.'),
    offeredBy: z.string().describe('The name of the user who offers the suggested skill. This must be a real user from the provided list.'),
    matchReason: z.string().describe('Explanation of why this skill swap is a good match.'),
  })
);
export type SkillSwapOutput = z.infer<typeof SkillSwapOutputSchema>;

export async function suggestSkillSwaps(input: SkillSwapInput['currentUser']): Promise<SkillSwapOutput> {
  return skillMatchSuggestionsFlow({
    currentUser: input,
    allUsers: allUsersList,
  });
}

const skillMatchPrompt = ai.definePrompt({
  name: 'skillMatchPrompt',
  input: {schema: SkillSwapInputSchema},
  output: {schema: SkillSwapOutputSchema},
  prompt: `You are an expert skill matchmaker. Given a user's listed skills offered and skills needed, suggest potential skill swaps with other users from the provided list.

Current User Skills Offered: {{currentUser.skillsOffered}}
Current User Skills Needed: {{currentUser.skillsNeeded}}

Available Users:
{{#each allUsers}}
- User: {{name}}, Offers: {{skillsOffered}}, Needs: {{skillsNeeded}}
{{/each}}

Find users from the 'Available Users' list who offer a skill that the current user needs. For each match, provide a reason for the suggested swap.

Format your response as a JSON array of objects, each containing the suggestedSkill, offeredBy (the real name of the user from the list), and matchReason.
`,
});

const skillMatchSuggestionsFlow = ai.defineFlow(
  {
    name: 'skillMatchSuggestionsFlow',
    inputSchema: SkillSwapInputSchema,
    outputSchema: SkillSwapOutputSchema,
  },
  async input => {
    const {output} = await skillMatchPrompt(input);
    return output!;
  }
);
