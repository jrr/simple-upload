import { Server } from "https://deno.land/std@0.114.0/http/server.ts";
import { multiParser } from 'https://deno.land/x/multiparser@0.114.0/mod.ts'

const server = new Server({
  addr: ":8000", handler: async (req) => {

    const parsed = await multiParser(req)
    console.log(parsed);


    return new Response(`
    <h3>Deno http module</h3>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <div>singleStr: <input type="text" name="singleStr" /></div>
      <div>singleImg: <input type="file" name="singleImg"/></div>
      <input type="submit" value="Upload" />
    </form>
  `, {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    })
  }
});


await server.listenAndServe()