import { engineFactory, ensureDir, Form, multiParser, Server } from "./deps.ts";

const PORT = 8000;

if (Deno.args.length != 1) {
  console.log(`Usage: simple-upload.ts ./output-dir`);
  Deno.exit();
}

const OUTPUT_DIR = Deno.args[0];

function respond(s: string) {
  return new Response(s, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
const handlebarsEngine = engineFactory.getHandlebarsEngine();

// CSS, JS in separate files to play nicely with code formatter.
const css = await Deno.readTextFile("src/style.css");
const js = await Deno.readTextFile("src/page.js");
const template = await Deno.readTextFile("src/page.hbs");
const renderPage = (props: { responseMessage?: string }) => {
  return respond(handlebarsEngine(template, { ...props, css, js }));
};

const server = new Server({
  port: PORT,
  handler: async (req) => {
    console.info(`${req.method} ${req.url}`);
    if (req.method === "POST") {
      const parsed = await multiParser(req);
      if (parsed) {
        const numFiles = await writeFiles(parsed);
        return renderPage({ responseMessage: `Uploaded ${numFiles} files.` });
      } else {
        return renderPage({ responseMessage: "Parse error." });
      }
    }
    return renderPage({});
  },
  // onError: (e) => console.error(`DENO HTTP onError!`, e),
});

console.log(`listening on :${PORT}, writing files to ${OUTPUT_DIR}`);

await server.listenAndServe();

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
