import { readFile, writeFile, mkdir } from "fs/promises";
import { transform } from "@svgr/core";
import fg from "fast-glob";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svgRoot = path.join(__dirname, "svg");
const srcRoot = path.join(__dirname, "src");

// Find all first-level subfolders in /svg
const folders = await fg("*", {
    cwd: svgRoot,
    onlyDirectories: true,
});

for (const folder of folders) {
    const svgDir = path.join(svgRoot, folder);
    const outDir = path.join(srcRoot, folder);

    await mkdir(outDir, { recursive: true });

    const files = await fg("*.svg", { cwd: svgDir });

    if (files.length === 0) {
        console.log(`No SVGs in ${svgDir}`);
        continue;
    }

    for (const file of files) {
        const svgPath = path.join(svgDir, file);
        const svg = await readFile(svgPath, "utf8");

        const componentName = path
            .basename(file, ".svg")
            .replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

        const tsx = await transform(
            svg,
            {
                typescript: true,
                jsxRuntime: "automatic",
                plugins: [
                    "@svgr/plugin-jsx",
                    "@svgr/plugin-prettier",
                ],
                icon: true
            },
            { componentName }
        );
        const outPath = path.join(outDir, file.replace(".svg", ".tsx"));

        await writeFile(outPath, tsx);
        console.log(`Generated: ${outPath}`);
    }
}
