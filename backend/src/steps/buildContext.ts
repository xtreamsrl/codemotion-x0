import { NewComponentDesignOutput } from './designNewComponent';
import LIBRARY_COMPONENTS_METADATA from '../data/components.json';

type ComponentContext = {
  name: string;
  description: string;
  usageReason: string;
  extension: string;
  importCode: string;
  info: string; // TODO : find a better name for this field
  usageExamples: string;
}

export type Context = NewComponentDesignOutput & {
  components: ComponentContext[];
}

/**
 * For each suggested library component, build the context for the component merging the component metadata with
 * the usage reason generated in the design step.
 * @param inputs - The output of the design step
 */
export function buildContextStep(inputs: NewComponentDesignOutput): Context {
  const context: ComponentContext[] = [];
  for (const suggestedComponent of inputs.useLibraryComponents) {
    const component = LIBRARY_COMPONENTS_METADATA.filter(componentMeta => componentMeta.name === suggestedComponent.libraryComponentName);
    if (component.length === 0) {
      throw new Error(`Component ${suggestedComponent.libraryComponentName} not found in the library`);
    }
    context.push({
      name: component[0].name,
      description: component[0].description,
      usageReason: suggestedComponent.libraryComponentUsageReason,
      extension: component[0].extension,
      importCode: component[0].docs.import.code.trim(),
      info: component[0].docs.info.map(info => `\`\`\`${info.source}\n${info.code.trim()}\n\`\`\``).join('\n'),
      usageExamples: component[0].docs.examples.map(example => `\`\`\`${example.source}\n${example.code.trim()}\n\`\`\``).join('\n'),
    });
  }
  return {
    ...inputs,
    components: context,
  };
}
