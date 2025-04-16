// From https://solana.stackexchange.com/questions/16703/can-anchor-client-be-used-with-solana-web3-js-2-0rc
import { createFromRoot } from "codama";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { renderJavaScriptVisitor } from "@codama/renderers";
import path from "path";
import { promises as fs } from "fs";

const loadJSON = async (...pathSegments: Array<string>) => {
  const filePath = path.join(...pathSegments);
  try {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(`Failed to load JSON file: ${filePath} does not exist`);
    }
    throw error;
  }
};

// Instantiate Codama
const idl = await loadJSON("target", "idl", "escrow.json");

const codama = createFromRoot(rootNodeFromAnchor(idl));

// Render JavaScript.
const generatedPath = path.join("dist", "js-client");
codama.accept(renderJavaScriptVisitor(generatedPath));