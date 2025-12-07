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

const SkillSwapInputSchema = z.object({
  skillsOffered: z.array(z.string()).describe('List of skills the user offers.'),
  skillsNeeded: z.array(z.string()).describe('List of skills the user needs.'),
});
export type SkillSwapInput = z.infer<typeof SkillSwapInputSchema>;

const SkillSwapOutputSchema = z.array(
  z.object({
    suggestedSkill: z.string().describe('A skill offered by another user that matches a skill needed by the current user.'),
    offeredBy: z.string().describe('The user who offers the suggested skill.'),
    matchReason: z.string().describe('Explanation of why this skill swap is a good match.'),
  })
);
export type SkillSwapOutput = z.infer<typeof SkillSwapOutputSchema>;

export async function suggestSkillSwaps(input: SkillSwapInput): Promise<SkillSwapOutput> {
  return skillMatchSuggestionsFlow(input);
}

const skillMatchPrompt = ai.definePrompt({
  name: 'skillMatchPrompt',
  input: {schema: SkillSwapInputSchema},
  output: {schema: SkillSwapOutputSchema},
  prompt: `You are an expert skill matchmaker. Given a user's listed skills offered and skills needed, suggest potential skill swaps with other users.\n\nSkills Offered: {{skillsOffered}}\nSkills Needed: {{skillsNeeded}}\n\nConsider skills that complement each other or could lead to a beneficial exchange. Provide a reason for each suggested match.\n\nFormat your response as a JSON array of objects, each containing the suggestedSkill, offeredBy (a fictional user name), and matchReason.`,
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
