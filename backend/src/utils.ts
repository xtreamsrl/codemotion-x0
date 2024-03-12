export type PipelineInputs = {
  userDescription: string;
  framework: string;
};

export function formatString(templateString: string, values: Record<string, string>) {
  let formattedString = templateString;
  for (const key in values) {
    const placeholder = `{${key}}`;
    const value = values[key];
    formattedString = formattedString.replace(new RegExp(placeholder, 'g'), value);
  }
  return formattedString;
}
