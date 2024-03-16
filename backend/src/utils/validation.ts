import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import ReactDom from 'react-dom/server';
import { ThemeProvider } from './theme';
import React from 'react';

type TranspileTypeScriptOutput = {
  jsxSourceCode?: string;
  tsErrors: string[];
};

type RenderComponentOutput = {
  success: boolean;
  errors: string[];
}

export type ValidationOutput = {
  success: boolean;
  errors: string[];
}

/**
 * Utils function to validate and transpile TS source code to JS
 * @param sourceCode The TypeScript source code to validate and transpile
 */
function transpileTypeScript(sourceCode: string): TranspileTypeScriptOutput {
  // Write the source code to a temporary file
  const tempFilePath = path.join(__dirname, '..', './tmp', 'tempFile.tsx');
  fs.writeFileSync(tempFilePath, sourceCode);

  // Specify compiler options
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    useDefineForClassFields: true,
    lib: ['es2020', 'dom'],
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
    // Create a Program to represent the project.
    // A Program is an immutable collection of 'SourceFile's and a 'CompilerOptions' that represent a compilation unit.
    const program = ts.createProgram([...libFiles, tempFilePath], compilerOptions);

    // Get all TypeScript syntactic and semantic diagnostics
    const syntacticDiagnostics = program.getSyntacticDiagnostics();
    const semanticDiagnostics = program.getSemanticDiagnostics();

    // Combine and format the diagnostics errors
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

    // Transpile ts to js
    const result = ts.transpileModule(sourceCode, {
      compilerOptions,
    });
    return {
      jsxSourceCode: result.outputText,
      tsErrors: [],
    };
  } catch (e) {
    console.error(e);
    throw new Error('Error transpiling TypeScript', { cause: e });
  }
}

/**
 * Utils function to render the component from the transpiled JavaScript and check for errors
 * @param jsxSourceCode The transpiled JavaScript source code to render
 */
function testRenderComponent(jsxSourceCode: string): RenderComponentOutput {
  // Write the transpiled JavaScript to a temporary file
  const tempFilePath = path.join(__dirname, '..', './tmp', 'tempFile.tsx');
  fs.writeFileSync(tempFilePath, jsxSourceCode, 'utf8');

  // Dynamically import the temporary file as a module
  try {
    const module = require(tempFilePath);
    const component = module.default;

    // Use react-dom/server API to render the component
    ReactDom.renderToString(React.createElement(ThemeProvider, {
      children: React.createElement(component),
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

/**
 * Validate and transpile TypeScript source code to JavaScript, then test JSX rendering
 * @param sourceCode The TypeScript source code to validate, transpile and render
 */
export function validate(sourceCode: string): ValidationOutput {
  const errors = [];
  let success = true;
  const { jsxSourceCode, tsErrors } = transpileTypeScript(sourceCode);

  if (tsErrors.length > 0) {
    success = false;
    errors.push(...tsErrors);
  } else {
    if (!jsxSourceCode) {
      throw new Error('Error transpiling TypeScript');
    }
    const renderOutput = testRenderComponent(jsxSourceCode);
    if (!renderOutput.success) {
      success = false;
      errors.push(...renderOutput.errors);
    }
  }
  return {
    success,
    errors,
  };
}
