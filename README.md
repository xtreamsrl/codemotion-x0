# Create your own v0 exploiting generative AI

## Setup
- Install backend project dependencies
```shell
cd backend
pnpm i
```
- Install frontend project dependencies
```shell
cd frontend
pnpm i
```
- Copy `sample.env` in `config.env`
- Paste the OpenAI API key from the chat into `config.env`

## Pipeline

![The generation pipeline flow diagram](pipeline.png)

### Design Step
`Generative Task`

- A preliminary ideation step where no code is involved
- The user's request is enriched and converted into a list of components from our component library to be used

```typescript
async function designStep(inputs: PipelineInputs): Promise<DesignNewComponentOutput> {
  // Retrieve context
  // Format prompts
  // Invoke llm
  // Parse/format output
}
```

### Code Generation Step
`Generative Task`

- Code generation step where the user's request is converted into code
- The components listed in the previous step are used to generate the code

```typescript
async function codeGenerationStep(inputs: DesignNewComponentOutput): Promise<string> {
  // Retrieve context
  // Format prompts
  // Invoke llm
  // Parse/format output
}
```

### Validation Step
`Deterministic Task`

- Sometimes llm can generate code that is not valid, this step is used to ensure that the generated code is valid
- The TypeScript source code is checked and transpiled to JSX to be rendered with `react-dom/server` API

```typescript
function validationStep(sourceCode: string): ValidationOutput {}
```

### Fix Errors Step
`Generative Task`

- If the generated code is not valid, this step is used to fix the errors

```typescript
async function fixErrorsStep(sourceCode: string, errors: string[]): Promise<string> {
  // Format prompts
  // Invoke llm
  // Parse/format output
}
```
