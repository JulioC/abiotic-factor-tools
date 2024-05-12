import fs from 'fs/promises';
import path from 'path';
import { injectable } from 'tsyringe';
import { RecipesParserService } from '../Parsers';
import { ItemsParserService, ParsedItem } from '../Parsers/Items';
import { ObjectsService } from '../UnrealEngine';
import { BaseExporter } from './BaseExporter';
import { WIKI_IGNORED_ITEMS, WIKI_ITEM_NAME_OVERRIDES } from './constants';

@injectable()
export class WikiInventoryIconsExporter extends BaseExporter {
  prefix = 'Item Icon - ';

  constructor(
    protected itemsParserService: ItemsParserService,
    protected recipesParserService: RecipesParserService,
    protected objectsService: ObjectsService
  ) {
    super();
  }

  override async run(outputPath: string) {
    const parsedItems = await this.itemsParserService.getParsedItems();

    const outputIconsPath = path.join(outputPath, 'Icons');
    await fs.mkdir(outputIconsPath, { recursive: true });

    for (const parsedItem of parsedItems) {
      if (this.isIgnored(parsedItem)) {
        continue;
      }

      // NOTE: inventory icons must have their alpha channel inverted
      // This is done with a shell script, but we should add that logic to the exporter
      // To invert, use: `mogrify -channel A -negate *.png`

      // TODO: compress generated PNGs

      try {
        const itemName = this.formatItemName(parsedItem);
        const outputFilename = path.join(
          outputIconsPath,
          `${this.prefix}${itemName}.png`
        );
        await fs.copyFile(parsedItem.inventoryIconFilename, outputFilename);
        console.log(`Exported icon for ${parsedItem.rowName}`);
      } catch {
        console.warn(
          `Failed to export inventor icon for "${parsedItem.rowName}"`
        );
      }
    }
  }

  protected formatItemName(parsedItem: ParsedItem) {
    const override = WIKI_ITEM_NAME_OVERRIDES[parsedItem.rowName];
    const name = override ?? parsedItem.name;
    return name.replace(/"/g, '');
  }

  protected isIgnored(parsedItem: ParsedItem) {
    return WIKI_IGNORED_ITEMS.includes(parsedItem.rowName);
  }
}
