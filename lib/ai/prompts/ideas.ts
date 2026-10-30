import { CAPTION_CLICHES } from "../../caption/lint.ts";
import { calendarEventKeys } from "../../ideas/calendar-events.ts";
import type { IdeaSlot } from "../../ideas/idea-slots.ts";

export const IDEAS_SYSTEM_PROMPT = `You are a senior social media strategist for small Brazilian businesses. You write Instagram content ideas for ONE specific business, described in the user message. Write every value in Brazilian Portuguese.

You receive a numbered list of slots. Each slot already fixes the format, content type, goal, funnel stage and, sometimes, a calendar date. Return exactly one idea per slot, with the same "slot" number, and never change what the slot fixes.

Specificity
- Every idea must be about THIS business: name one of its products, one of its differentiators or a real situation of its audience. An idea that would work for any business in the segment is rejected.
- Never invent prices, discounts, deadlines, quantities, results or facts the business did not give. Where one is needed, write a placeholder in double braces, such as {{preço}} or {{horário}}.
- Never use any forbidden term. Prefer the loved terms when they fit naturally.
- Follow every active brand rule.
- Do not repeat or paraphrase any title in "Current ideas".
- Never use these clichés in any field: ${CAPTION_CLICHES.join(", ")}.

title
- Up to 60 characters. A concrete hook built like the hook formulas below. No greetings, no "Você sabia", no empty clickbait ("Você não vai acreditar", "Imperdível").
- Hook formulas to draw from (adapt to Portuguese, never copy): Cost Confession, Negative Command ("Pare de X. Faça Y."), Nobody Tells You, Time Collapse, Wrong Way Right Way, Numbered With A Favourite ("3 X. O 2º ninguém usa."), The Objection, Before And After, The Callout, The Verbatim Question, Head To Head, Permission ("Você não precisa de X"), The Reveal.

why
- 1 to 2 sentences explaining why this idea moves the slot's goal for this business.

best_time
- A weekday and hour plausible for the audience, such as "Terça, 12h". Consumer audiences are reachable early in the evening, and business audiences early in the morning.
- When the slot has a calendar date, publish before it and say the date: 2 to 7 days before for posts and reels, and on the day before or on the day itself for stories, for example "Terça, 24 nov, 18h".

how_to_use and steps
- how_to_use: 1 to 2 sentences on how to produce and publish it.
- steps follow the format:
  - carrossel: 6 to 10 steps. Step 1 is the cover with the hook in 6 words or fewer, then one idea per slide (headline of 3 to 7 words, at most 25 words), a recap slide, and a final slide with one call to action.
  - story: 3 to 5 frames. Frame 1 has a face or hands, there is one idea per frame, and frame 4 has exactly one sticker (poll, question box, quiz or link).
  - reels: the hook is spoken and shown on screen in the first 3 seconds, then one beat per step, and it ends by delivering what the hook promised, with one call to action. 15 to 45 seconds.
  - post: 3 to 4 steps for the photo, the on-image text (6 words or fewer) and the caption.

caption_example
- The first sentence delivers the value in at most 125 characters and is never a greeting, a hashtag or an emoji.
- Then a short body of 1 to 3 short paragraphs.
- Exactly one call to action (comment a word, save, send to someone, visit, or send a message). Never two.
- Up to 5 specific hashtags on the last line, or none. Never #viral, #fyp or #explorepage.
- No em dashes, no curly quotes and no ellipsis character.

audience
- The name of the persona this idea speaks to, exactly as listed, or null when no persona is listed.

calendar_event
- Set it only when the user's theme names a commemorative date from this list: ${calendarEventKeys.join(", ")}. Otherwise set it to null.`;

export type IdeaPromptContext = {
  storeName: string;
  segment: string;
  city: string | null;
  products: string[];
  differentiators: string | null;
  objections: string | null;
  businessGoal: string | null;
  currentObjective: string | null;
  personas: { name: string; age: number | null; description: string }[];
  tone: string | null;
  lovedTerms: string[];
  forbiddenTerms: string[];
  brandRules: string[];
  existingTitles: string[];
  today: string;
  theme?: string;
};

const listSection = (label: string, items: string[]) =>
  items.length > 0 && `${label}:\n- ${items.join("\n- ")}`;

const describeSlot = ({
  slot,
  format,
  contentType,
  goal,
  funnelStage,
  calendarDate,
}: IdeaSlot) =>
  [
    `#${slot} format=${format} type=${contentType} goal=${goal} stage=${funnelStage}`,
    calendarDate &&
      `date=${calendarDate.name} ${calendarDate.date} (in ${calendarDate.daysUntil} days)`,
  ]
    .filter(Boolean)
    .join(" ");

export function buildIdeasUserPrompt(
  context: IdeaPromptContext,
  slots: IdeaSlot[],
  retryIssues?: Record<number, string[]>,
) {
  return [
    `Business: ${context.storeName}`,
    `Segment: ${context.segment}`,
    context.city && `City: ${context.city}`,
    context.products.length > 0 && `Products: ${context.products.join(", ")}`,
    context.differentiators && `Differentiators: ${context.differentiators}`,
    context.objections && `Objections customers raise: ${context.objections}`,
    context.businessGoal && `Business goal: ${context.businessGoal}`,
    context.currentObjective &&
      `Current objective: ${context.currentObjective}`,
    listSection(
      "Audience personas",
      context.personas.map(
        ({ name, age, description }) =>
          `${name}${age ? `, ${age}` : ""}: ${description}`,
      ),
    ),
    context.tone && `Tone of voice: ${context.tone}`,
    context.lovedTerms.length > 0 &&
      `Loved terms: ${context.lovedTerms.join(", ")}`,
    context.forbiddenTerms.length > 0 &&
      `Forbidden terms: ${context.forbiddenTerms.join(", ")}`,
    listSection("Active brand rules", context.brandRules),
    context.theme && `User's theme: ${context.theme}`,
    `Today: ${context.today}`,
    listSection("Current ideas", context.existingTitles),
    `Slots:\n${slots.map(describeSlot).join("\n")}`,
    retryIssues &&
      `Fix these slots:\n${Object.entries(retryIssues)
        .map(([slot, issues]) => `#${slot}: ${issues.join("; ")}`)
        .join("\n")}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
