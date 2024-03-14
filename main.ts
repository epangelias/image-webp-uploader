import ImageToUrl from "@epi/image-to-url";
import ImageToWebp from "@epi/image-to-webp";

const API_KEY = "910a1b20168ef28376f3df239b16bdd7";

// import sharp from "npm:sharp";

// const urls = [];

// for await (const { name } of Deno.readDir("./images")) {
//   const ext = name.split(".").at(-1);
//   const source = import.meta.dirname + "/images/" + name;

//   if (ext !== "jpg" && ext !== "png") continue;

//   const buffer = await Deno.readFile(source);

//   const webp = await ImageToWebp(buffer, ext);

//   const file: File = new File([webp], name, { type: "image/webp" });
//   const url = await ImageToUrl(file, "910a1b20168ef28376f3df239b16bdd7");

//   urls.push(url);
// }

// await Deno.writeTextFile("./urls.txt", urls.join("\n"), { append: true });
// console.log(urls.join("\n"));

import { Context, Hono } from "https://deno.land/x/hono/mod.ts";

const app = new Hono();

const style =
  `<style>html{color-scheme: light dark; font: caption} body{width: 880px; padding: 2rem; margin: 0 auto;} img{max-width: 100%}</style>`;

app.get("/", (ctx: Context) => {
  return ctx.html(`
    <h1>Convert Image To WebP</h1>
    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" onchange="this.parentElement.submit()" autofocus autocomplete="off"><br/>
    </form>${style}`);
});

app.post("/", async (ctx: Context) => {
  const file = await ctx.req.formData();
  const image = file.get("image") as File;
  const buffer = new Uint8Array(await image.arrayBuffer());
  const ext = image.name.split(".").at(-1);
  if (ext != "png" && ext != "jpg") {
    return ctx.text("Invalid File Type: " + ext);
  }
  const webp = await ImageToWebp(buffer, ext);
  const webpFile = new File([webp], image.name + ".webp", {
    type: "image/webp",
  });
  const url = await ImageToUrl(webpFile, API_KEY);
  return ctx.html(
    `<a href="/"><button>Upload Another</button></a><br/><br/><input autofocus value="${url}" onload="this.focus()"><br/><br/><img src="${url}"/>${style}`,
  );
});

Deno.serve(app.fetch);
