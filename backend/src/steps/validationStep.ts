import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import ReactDom from 'react-dom/server';
import { ThemeProvider } from './theme';
import React from 'react';

export type ValidationOutput = {
  success: boolean;
  errors: string[];
}

type RenderOutput = {
  success: boolean;
  errors: string[];
}

type CompileTypeScriptOutput = {
  compiledJs?: string;
  tsErrors: string[];
};

// Function to compile TypeScript to JavaScript
const compileTypeScript = (sourceCode: string): CompileTypeScriptOutput => {
  // Write the source code to the temporary file
  const tempFilePath = path.join(__dirname, '..', './tmp', 'tempFile.tsx');
  fs.writeFileSync(tempFilePath, sourceCode);

  // Specify compiler options
  // todo alert is not recognized
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    useDefineForClassFields: true,
    lib: ['es2020', 'dom', 'dom.Iterable'],
    module: ts.ModuleKind.ESNext,
    skipLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    isolatedModules: true,
    noEmit: true,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
  };

  const libFiles = [
    require.resolve('typescript/lib/lib.dom.d.ts'),
    require.resolve('typescript/lib/lib.es2020.d.ts'),
  ];

  try {
    // Create a program to represent the project. It's a single file in this case
    const program = ts.createProgram([...libFiles, tempFilePath], compilerOptions);

    // Get all TypeScript syntactic and semantic diagnostics
    const syntacticDiagnostics = program.getSyntacticDiagnostics();
    const semanticDiagnostics = program.getSemanticDiagnostics();

    // Combine the diagnostics into one array
    const allDiagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];
    const errors = allDiagnostics.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error)
      .filter(diagnostic => !!diagnostic.file)
      .map(diagnostic => {
        const { line, character } = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        return `(line ${line + 1}, column ${character + 1}): ${message}`;
      });

    // Remove the temporary file
    fs.unlinkSync(tempFilePath);

    if (errors.length > 0) {
      return {
        tsErrors: errors,
      };
    }

    const result = ts.transpileModule(sourceCode, {
      compilerOptions,
    });
    console.log('TypeScript compiled successfully.', result.diagnostics);
    return {
      compiledJs: result.outputText,
      tsErrors: [],
    };
  } catch (e) {
    console.error(e);
    throw new Error('Error compiling TypeScript', { cause: e });
  }

};

// Function to dynamically import and test the React component
function testRenderComponent(compiledJs: string): RenderOutput {
  // Write the compiled JavaScript to a temporary file
  const tempFilePath = path.join(__dirname, '..', './tmp', 'tempFile.tsx');
  fs.writeFileSync(tempFilePath, compiledJs, 'utf8');

  // Dynamically import the temporary file as a module
  try {
    const importedModule = require(tempFilePath);
    const Component = importedModule.default;

    // Use React Testing Library to render the component
    ReactDom.renderToString(React.createElement(ThemeProvider, {
      children: React.createElement(Component),
    }));

  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: [error.message],
      };
    } else throw error;
  } finally {
    fs.unlinkSync(tempFilePath);
  }
  return {
    success: true,
    errors: [],
  };
}

// Utils function to validate the component from TypeScript source code
export async function validateComponentStep(sourceCode: string): Promise<ValidationOutput> {
  const { compiledJs, tsErrors } = compileTypeScript(sourceCode);

  if (tsErrors.length > 0) {
    console.error('TypeScript errors:', tsErrors);
    return {
      success: false,
      errors: tsErrors,
    };
  } else {
    if (!compiledJs) {
      throw new Error('Error compiling TypeScript');
    }
    const renderOutput =  testRenderComponent(compiledJs);
    if (renderOutput.success) {
      console.log('Component rendered successfully');
      return {
        success: true,
        errors: [],
      };
    } else {
      // console.error('Error rendering component:', renderOutput.errors);
      return {
        success: false,
        errors: renderOutput.errors,
      };
    }
  }
}
