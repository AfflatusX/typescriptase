#!/usr/bin/env node

import { Glob } from "glob";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, sep } from "path"

import { Module } from "./index";

if (process.argv.length !== 3) {
  throw new Error("Usage is `typescriptase GLOB`");
}
const moduleGlob: string = process.argv[2];



new Glob(
  moduleGlob,
  {},
  (err: Error | null, files: string[]) => {
    if (err) {
      throw err;
    }
    files.forEach(
      (modulePath: string) => {
        // tslint:disable-next-line
        const codegen: any = require(`../${modulePath}`);
        for (let key in codegen) {
          if (codegen[key] instanceof Module) {
            const module: Module = codegen[key];
            const dir: string = dirname(module.destination());
            let partialDir: string = "";
            dir.split(sep).forEach(
              (currentValue: string, index: number) => {
                partialDir += `${currentValue}${sep}`;
                if (!existsSync(partialDir)) {
                  mkdirSync(partialDir);
                }
              },
            );
            writeFileSync(module.destination(), module.print(modulePath));
          }
        }
      },
    );
  },
)
