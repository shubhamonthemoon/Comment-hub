const fs = require("node:fs");
const vm = require("node:vm");
const html = fs.readFileSync("index.html", "utf8");
const match = html.match(/<script>([\\s\\S]*?)<\\/script>/);
if (!match) throw new Error("Inline application script was not found");
new vm.Script(match[1], { filename: "index.html:inline-script" });
for (const file of ["api/config.js", "api/health.js", "api/generate-comment.js"]) {
  const source = fs.readFileSync(file, "utf8").replace(/^export default /m, "");
  new vm.Script(source, { filename: file });
}
const schema = fs.readFileSync("supabase/schema.sql", "utf8");
for (const table of ["creators", "posts", "comment_versions", "scan_runs", "user_preferences"]) {
  if (!schema.includes("public." + table)) throw new Error("Missing database table: " + table);
}
if (!schema.includes("enable row level security")) throw new Error("RLS is not enabled");
console.log("Creator Support AI checks passed.");
