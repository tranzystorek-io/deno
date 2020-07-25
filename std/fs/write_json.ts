// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Replacer = (key: string, value: any) => any;

export interface WriteJsonOptions extends Deno.WriteFileOptions {
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
    return JSON.stringify(
      object,
      options.replacer as string[],
      options.spaces,
    );
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
