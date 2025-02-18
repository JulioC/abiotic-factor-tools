import 'reflect-metadata';
import { container } from 'tsyringe';
import { WikiInventoryIconsExporter } from './Exporters/WikiInventoryIconsExporter';
import { WikiItemsExporter } from './Exporters/WikiItemsExporter';
import { WikiRecipesExporter } from './Exporters/WikiRecipesExporter';
import { TOKEN_OBJECTS_BASE_PATH } from './UnrealEngine';

if (!process.env.ABF_EXTRACTED_PATH)
  throw new Error(`Env ABF_EXTRACTED_PATH should not be empty`);
const INPUT_PATH = process.env.ABF_EXTRACTED_PATH;

if (!process.env.ABF_EXPORTED_PATH)
  throw new Error(`Env ABF_EXPORTED_PATH should not be empty`);
const OUTPUT_PATH = process.env.ABF_EXPORTED_PATH;

container.register(TOKEN_OBJECTS_BASE_PATH, { useValue: INPUT_PATH });

const itemsExporter = container.resolve(WikiItemsExporter);
const inventoryIconsExporter = container.resolve(WikiInventoryIconsExporter);
const wikiRecipesExporter = container.resolve(WikiRecipesExporter);

async function run() {
  await runExporters();
}

async function runExporters() {
  const exporters = [
    // itemsExporter,
    inventoryIconsExporter,
    // wikiRecipesExporter,
  ];

  for (const exporter of exporters) {
    exporter.run(OUTPUT_PATH);
  }
}

run();
