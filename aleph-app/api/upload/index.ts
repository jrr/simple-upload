import type { APIHandler } from "aleph/types.d.ts";
import { ensureDir, Form, multiParser } from "../../deps.ts";

const OUTPUT_DIR = "./files";

export const handler: APIHandler = async ({ request, response, data }) => {
  const parsed = await multiParser(request);
  if (parsed) {
    const numFiles = await writeFiles(parsed);
    response.json({ outcome: "success", numFiles });
    return;
  } else {
    response.json({ outcome: "error" });
    return;
  }
};

async function writeFiles(parsed: Form): Promise<number> {
  const files = (
    "length" in parsed.files.files ? parsed.files.files : [parsed.files.files]
  ).filter((f) => f.size > 0 && f.filename != "");

  await ensureDir(OUTPUT_DIR);

  for (const file of files) {
    const filename = `${OUTPUT_DIR}/${file.filename}`;
    console.log(`received ${filename} (${file.size})..`);
    await Deno.writeFile(filename, file.content);
  }
  return files.length;
}
