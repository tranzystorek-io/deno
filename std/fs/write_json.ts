// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { EOL, format } from "./eol.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Replacer = (key: string, value: any) => any;

export interface WriteJsonOptions extends Deno.WriteFileOptions {
  appendNewline?: boolean;
  newlineFormat?: "auto" | "CRLF" | "LF";
  replacer?: Array<number | string> | Replacer;
  spaces?: number | string;
}

function serialize(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  options: WriteJsonOptions,
): string {
  try {
    let jsonContent = JSON.stringify(
      object,
      options.replacer as string[],
      options.spaces,
    );

    if (options.appendNewline) jsonContent = `${jsonContent}\n`;

    if (options.newlineFormat) {
      let eol: EOL;
      switch (options.newlineFormat) {
        case "auto": {
          eol = Deno.build.os === "windows" ? EOL.CRLF : EOL.LF;
          break;
        }
        case "CRLF": {
          eol = EOL.CRLF;
          break;
        }
        case "LF":
        default:
          eol = EOL.LF;
      }
      jsonContent = format(`${jsonContent}`, eol);
    }

    return jsonContent;
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}

/* Writes an object to a JSON file. */
export async function writeJson(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  options: WriteJsonOptions = {},
): Promise<void> {
  const jsonContent = serialize(filePath, object, options);
  await Deno.writeTextFile(filePath, jsonContent, {
    append: options.append,
    create: options.create,
    mode: options.mode,
  });
}

/* Writes an object to a JSON file. */
export function writeJsonSync(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  options: WriteJsonOptions = {},
): void {
  const jsonContent = serialize(filePath, object, options);
  Deno.writeTextFileSync(filePath, jsonContent, {
    append: options.append,
    create: options.create,
    mode: options.mode,
  });
}
