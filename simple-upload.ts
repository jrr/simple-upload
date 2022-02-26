import { Server } from "https://deno.land/std@0.114.0/http/server.ts";
import {
  Form,
  multiParser,
} from "https://deno.land/x/multiparser@0.114.0/mod.ts";

const server = new Server({
  addr: ":8000",
  handler: async (req) => {
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
});

await server.listenAndServe();

async function writeFiles(parsed: Form) {
  const files = ("length" in parsed.files.files)
    ? parsed.files.files
    : [parsed.files.files];
  for (const file of files) {
    const filename = `./files/${file.filename}`;
    console.log(`writing ${filename} (${file.size})..`);
    await Deno.writeFile(filename, file.content);
  }
}
