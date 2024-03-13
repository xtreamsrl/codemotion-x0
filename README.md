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
- Paste the OpenAI key from the chat into `config.env`

## Pipeline

### Design Step
`Generative Task`

- A preliminary ideation step where no code is involved
- The user's request is enriched and converted into a list of components from our component library to be used

```typescript
async function designStep(inputs: PipelineInputs): Promise<DesignNewComponentOutput> {
  // Format prompts
  // Invoke llm
  // Parse/format output
}
```

### Code Generation Step
`Generative Task`

- 

```typescript
async function codeGenerationStep(inputs: DesignNewComponentOutput): Promise<string> {
  // Create context
  // Format prompts
  // Invoke llm
  // Parse/format output
}
```

### Validation Step
`Deterministic Task`

```typescript
async function validationStep(sourceCode: string) {}
```

### Fix Errors Step
`Generative Task`

```typescript
async function fixErrorsStep(sourceCode: string, errors: string[]): Promise<string> {
  // Format prompts
  // Invoke llm
  // Parse/format output
}
```
