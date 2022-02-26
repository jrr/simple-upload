import { Server } from "https://deno.land/std@0.127.0/http/server.ts";
import { ensureDir } from "https://deno.land/std@0.127.0/fs/mod.ts";
import {
  Form,
  multiParser,
} from "https://deno.land/x/multiparser@0.114.0/mod.ts";

const PORT = 8000;

if (Deno.args.length != 1) {
  console.log(`Usage: simple-upload.ts ./output-dir`);
  Deno.exit();
}

const OUTPUT_DIR = Deno.args[0];

const server = new Server({
  port: PORT,
  handler: async (req) => {
    console.info(`${req.method} ${req.url}`);
    if (req.method === "POST") {
      const parsed = await multiParser(req);
      if (parsed) {
        await writeFiles(parsed);
      }

      return new Response('Upload complete. <a href="/">another</a>?', {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    } else {
      return new Response(
        `
    <h1>Simple Upload</h1>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <div>files: <input type="file" name="files" multiple/></div>
      <input type="submit" value="Upload" />
    </form>
  `,
        {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      );
    }
  },
  // onError: (e) => console.error(`DENO HTTP onError!`, e),
});

console.log(`listening on :${PORT}, writing files to ${OUTPUT_DIR}`);

await server.listenAndServe();

async function writeFiles(parsed: Form) {
  const files = ("length" in parsed.files.files)
    ? parsed.files.files
    : [parsed.files.files];

  await ensureDir(OUTPUT_DIR);

  for (const file of files) {
    const filename = `${OUTPUT_DIR}/${file.filename}`;
    console.log(`received ${filename} (${file.size})..`);
    await Deno.writeFile(filename, file.content);
  }
}
