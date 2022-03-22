import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import * as Shell from "./tools/shell";
import rimraf from "rimraf";
import { versions, outputDir } from "./config";

export const getDataDogOpenApiYaml = async (version: string): Promise<any> => {
  const url = `https://raw.githubusercontent.com/DataDog/datadog-api-client-typescript/${version}/.generator/schemas/v2/openapi.yaml`;

  try {
    const res = await fetch(url);
    return res.text();
  } catch (error) {
    throw error as any;
  }
};

const main = async () => {
  const tempDir = `.tmp-${outputDir}`;
  fs.mkdirSync(tempDir, { recursive: true });
  rimraf.sync(outputDir);
  fs.mkdirSync(outputDir, { recursive: true });
  const tasks = versions.map(async version => {
    const result = await getDataDogOpenApiYaml(version);
    const openapiFilename = path.join(outputDir, `openapi-${version}.yaml`);
    fs.writeFileSync(openapiFilename, result, { encoding: "utf-8" });
  });
  await Promise.all(tasks);
  rimraf.sync(tempDir);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
