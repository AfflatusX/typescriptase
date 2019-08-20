#!/usr/bin/env node

import { createHash, Hash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, sep } from "path";
import * as yargs from "yargs";

import { Builder, endTemplate, Module, startTemplate } from "./index";

if (require.main === module) {
  yargs
    .usage(
      "$0",
      true,
      (y: yargs.Argv<any>): yargs.Argv<any> => y
        .option(
          "expectNoChanges",
          {
            boolean: true,
            describe: "Expect No Changes",
          },
        )
        .option(
          "files",
          {
            array: true,
            demandOption: true,
            describe: "Files",
          },
        ),
      (argv: yargs.Arguments<any>): void => {
        argv.files.forEach(
          (path: string): void => {
            codegenFile(path, argv.expectNoChanges);
          },
        );
      },
    )
    .help()
    .argv;
}

export function codegenFile(
  path: string,
  expectNoChanges: boolean,
): void {
  let file: { [index: string]: any };
  file = require(`${process.cwd()}/${path}`);
  for (const name in file) {
    if (file[name] instanceof Module) {
      codegenModule(file[name], path, name, expectNoChanges);
    }
  }
}

export function codegenModule(
  module: Module,
  path: string,
  name: string,
  expectNoChanges: boolean,
): void {
  let dirBuilder: string = "";
  dirname(module.destination())
    .split(sep)
    .forEach((dirPart: string, index: number) => {
      dirBuilder += `${dirPart}${sep}`;
      if (!existsSync(dirBuilder)) {
        mkdirSync(dirBuilder);
      }
    });
  const builder: Builder = Builder.new({
    name,
    path,
  });
  const content: string = module.print(builder);
  codegenModuleWithBespokes(
    builder.getBespokes(),
    module.destination(),
    content,
    expectNoChanges,
  );
}

export function codegenModuleWithBespokes(
  bespokes: string[],
  destination: string,
  module: string,
  expectNoChanges: boolean,
): void {
  let mutableModule: string = module;
  let originalModule: string = "";
  if (existsSync(destination)) {
    originalModule = readFileSync(destination, "ascii");
    if (moduleCodegenIsInvalid(originalModule)) {
      throw new Error(`Invalid signature ${destination}`);
    }
    bespokes.forEach((bespoke: string) => {
      mutableModule = codegenModuleWithBespoke(
        bespoke,
        mutableModule,
        originalModule,
      );
    });
  }
  if (expectNoChanges && originalModule !== mutableModule) {
    throw new Error(`Codegen outdated ${destination}`);
  } else {
    writeFileSync(destination, mutableModule);
  }
}

export function moduleCodegenIsInvalid(
  module: string,
): boolean {
  const regexResult: RegExpExecArray | null = /SIGNED<<(.*)>>/.exec(module);
  if (regexResult === null) {
    return true;
  }
  const actualSignature: string = regexResult[1];
  const oldLines: string[] = module
    .split("\n")
    .slice(8);
  let newLines: string[] = [];
  let exclude: boolean = false;
  for (const oldLine of oldLines) {
    if (oldLine.indexOf("BESPOKE END") !== -1) {
      exclude = false;
    }
    if (exclude) {
      continue;
    }
    if (oldLine.indexOf("BESPOKE START") !== -1) {
      exclude = true;
    }
    newLines = [...newLines, oldLine];
  }
  const hash: Hash = createHash("SHA512");
  hash.update(newLines.join("\n"));
  const expectedSignature: string = hash.digest("base64");

  return actualSignature !== expectedSignature;
}

export function codegenModuleWithBespoke(
  bespoke: string,
  module: string,
  originalModule: string,
): string {
  const start: string = startTemplate.replace("@0", bespoke);
  const end: string = endTemplate.replace("@0", bespoke);
  const originalLines: string[] = originalModule.split("\n");
  const originalStartIdx: number = originalLines.findIndex(
    (line: string): boolean => line.indexOf(start) !== -1,
  );
  const originalEndIdx: number = originalLines.findIndex(
    (line: string): boolean => line.indexOf(end) !== -1,
  );
  if (originalStartIdx === -1 || originalEndIdx === -1) {
    return module;
  }
  const customCode: string[] = originalLines.slice(
    originalStartIdx + 1,
    originalEndIdx,
  );
  const lines: string[] = module.split("\n");
  const startIdx: number = lines.findIndex(
    (line: string): boolean => line.indexOf(start) !== -1,
  );
  const endIdx: number = lines.findIndex(
    (line: string): boolean => line.indexOf(end) !== -1,
  );
  const moduleStart: string[] = lines.slice(0, startIdx  + 1);
  const moduleEnd: string[] = lines.slice(endIdx);

  return ([] as string[])
    .concat(moduleStart, customCode, moduleEnd)
    .join("\n");
}
