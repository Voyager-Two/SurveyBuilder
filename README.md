- See live demo: https://survey-builder-nu.vercel.app/

## Testing locally
- `yarn install`
- `yarn run dev` 
- Go to `http://localhost:3000`

## Code architecture
- Feature code is inside `features/SurveyBuilder`
- Components inside `features/SurveyBuilder/components`
- `surveySlice.ts` Redux state
- Non-feature specific code is inside `common` folder

## Technical details
- Next.js & React
- Redux for managing other state, such as which step user is on
- Mantine as UI framework

## AI usage notice
- I've used AI extensively via Cursor editor. The code patterns and style are based on my personal taste and are based on my many years of experience both professionally and based on projects. AI needs good guidance from an experienced engineer, otherwise it can use bad patterns without complaining. So in essence, AI is only good (in scale) as good as the engineer guiding it. Without good guidance and prompting, AI-generated code can become very hard to maintain and scale.

## Improvements that could be made
- Use Tailwind CSS instead as per instructions
- Add form field validation w/ React Hook Form and Zod