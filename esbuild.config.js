const esbuild = require("esbuild");
const { default: copy } = require("esbuild-plugin-copy");

esbuild
  .build({
    entryPoints: ["./index.ts"],
    bundle: true,
    minify: true,
    sourcemap: false,
    platform: "node",
    target: ["node16.14"],
    outdir: "dist",
    plugins: [
      copy({
        assets: {
          from: ["./sample.txt"],
          to: ["./sample.txt"],
        },
      }),
    ],
  })
  .catch(() => process.exit(1));
