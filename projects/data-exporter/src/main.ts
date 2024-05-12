// main.ts
import path from 'path';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { WikiInventoryIconsExporter } from './Exporters/WikiInventoryIconsExporter';
import { WikiItemsExporter } from './Exporters/WikiItemsExporter';
import { ItemsParserService } from './Parsers/Items/ItemsParserService';
import { EnumsService, TOKEN_OBJECTS_BASE_PATH } from './UnrealEngine';

const DATA_BASE_PATH =
  '/home/julio/worspace/abiotic-factor-wiki/abiotic-factor-tools/data/';
const INPUT_PATH = path.join(DATA_BASE_PATH, 'input');
const OUTPUT_PATH = path.join(DATA_BASE_PATH, 'output');

container.register(TOKEN_OBJECTS_BASE_PATH, { useValue: INPUT_PATH });

const enumService = container.resolve(EnumsService);
const itemsService = container.resolve(ItemsParserService);
const itemsExporter = container.resolve(WikiItemsExporter);
const inventoryIconsExporter = container.resolve(WikiInventoryIconsExporter);

async function run() {
  // const v = await enumService.getEnumDisplayName(
  //   'E_CharacterSkills::NewEnumerator14'
  // );
  // console.log(`Value: ${v}`);

  // await checkDuplicatedNames();

  await runExporters();
  // const gameplayTags = await getItemsGameplayTags();
  // console.log(gameplayTags);
}

// async function getItemsGameplayTags() {
//   const items = await itemsService.getParsedItems();
//   const gameplayTagsSet = new Set(
//     Object.values(items).flatMap((item) => item.gameplayTags)
//   );
//   return [...gameplayTagsSet.values()];
// }

async function runExporters() {
  const exporters = [
    itemsExporter,
    // inventoryIconsExporter
  ];

  for (const exporter of exporters) {
    exporter.run(OUTPUT_PATH);
  }
}

// async function checkDuplicatedNames() {
//   const items = await itemsExporter.getData();

//   const nameMap = new Map();
//   for (const item of Object.values(items)) {
//     const previous = nameMap.get(item.name);
//     if (previous) {
//       console.log(
//         `Duplicated item name: ${item.name} (${item.rowName} and ${previous})`
//       );
//     }

//     nameMap.set(item.name, item.rowName);
//   }
// }

// console.log('Hello World');

run();
