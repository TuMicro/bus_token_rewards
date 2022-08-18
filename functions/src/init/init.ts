// for loading the .env file into process.env
import * as dotenv from 'dotenv';
import path from "node:path";
dotenv.config({
  path: path.resolve(process.cwd(), '.env.prod'), // when running tests this is overwritten (see root-hooks.ts)
});

export function init() {
  // Note: for some reason the output (console.log) from this function
  // can't be seen in the console while running the mocha tests
  
}