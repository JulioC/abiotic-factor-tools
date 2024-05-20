import _ from 'lodash';
import { injectable } from 'tsyringe';
import { ParsedRecipe, RecipesParserService } from '../Parsers';
import { ItemsParserService, ParsedItem } from '../Parsers/Items';
import { BaseExporter } from './BaseExporter';
import {
  WIKI_ALLOWED_LIQUIDS,
  WIKI_CATEGORIES,
  WIKI_GEAR_SLOTS,
  WIKI_IGNORED_ITEMS,
  WIKI_ITEM_NAME_OVERRIDES,
  WIKI_STATUSES,
} from './constants';

function formatNumber(n: number) {
  return n !== 0 ? n : undefined;
}

@injectable()
export class WikiItemsExporter extends BaseExporter {
  protected parsedRecipes: ParsedRecipe[] = [];
  protected parsedItems: ParsedItem[] = [];
  protected parsedItemsMap: Record<string, ParsedItem> = {};

  constructor(
    protected itemsParserService: ItemsParserService,
    protected recipesParserService: RecipesParserService
  ) {
    super();
  }

  protected override async warmUp() {
    this.parsedRecipes = await this.recipesParserService.getParsedRecipes();
    this.parsedItems = await this.itemsParserService.getParsedItems();

    this.parsedItemsMap = _.keyBy(this.parsedItems, 'rowName');
  }

  protected getName() {
    return 'Items';
  }

  protected async getData() {
    const items = this.parsedItems
      .filter((parsedItem) => !this.isIgnored(parsedItem))
      .map((parsedItem) => this.formatItem(parsedItem));

    return _.keyBy(items, 'name');
  }

  protected formatItem(parsedItem: ParsedItem) {
    // Exported data tries to follow the format previously used in Template:ItemInfobox
    // We should try improving this once we replace Cargo
    return {
      rowName: parsedItem.rowName,

      // General
      name: this.formatItemName(parsedItem),
      description: parsedItem.description,
      flavorText: parsedItem.flavorText,

      // Categories: Resources and Sub-components,Furniture and Benches,Tools,Light and Power,Base defense,Weapons and Ammo,Armor and Gear,Health and Medical,Food and Cooking,Farming,Travel and Vehicles
      category: this.formatCategory(parsedItem),

      // Stats
      weight: formatNumber(parsedItem.weight),
      stackSize: formatNumber(parsedItem.stackSize),
      radioactivity: formatNumber(parsedItem.radioactivity),

      // Durability
      ...this.formatDurabilityData(parsedItem),

      // Decay
      ...this.formatDecayData(parsedItem),

      // Battery
      batteryCapacity: this.formatBatteryCapacity(parsedItem),

      // Liquids
      ...this.formatLiquidData(parsedItem),

      // Research Minigame
      researchMaterial: parsedItem.researchMaterial,

      // Scrapping
      scrapResults: this.formatScrapResults(parsedItem),

      // Gear
      ...this.formatGearData(parsedItem),

      // Weapon
      ...this.formatWeaponData(parsedItem),
      //weaponChoppingQuality:

      // Consumable
      // This section should be filled for non-consumables in some cases!
      // applies and removes goes up to 9
      // TODO: figure out radiation levels
      ...this.formatConsumableData(parsedItem),
      // consumableOtherEffects: consumableData.armorChange,

      // Cooking
      ...this.formatCookingData(parsedItem),
      // Stages: Raw,Cooked,Burned

      // Farming
      // farmingProduceItem: parsedItem.cookableData.farmableDataRow,

      // Deployable
      //deployableObject:
    };
  }

  protected formatItemName(parsedItem: ParsedItem) {
    const override = WIKI_ITEM_NAME_OVERRIDES[parsedItem.rowName];
    const name = override ?? parsedItem.name;
    return name.replace(/"/g, '').replace(/ & /g, ' and ').replace(/&/g, '');
  }

  protected formatCategory(parsedItem: ParsedItem) {
    const firstRecipe = this.parsedRecipes.find(
      (r) => r.resultRowName === parsedItem.rowName
    );

    // TODO: we need a better heuristic, most items required hard-coded recipes
    return WIKI_CATEGORIES[firstRecipe?.category ?? ''];
  }

  protected formatBatteryCapacity(parsedItem: ParsedItem) {
    if (!parsedItem.liquidData.allowedLiquids.includes('Battery')) {
      return undefined;
    }

    return parsedItem.liquidData.maxLiquid;
  }

  protected formatLiquidData(parsedItem: ParsedItem) {
    // Ignore unknown liquids
    const allowedLiquids = parsedItem.liquidData.allowedLiquids.filter(
      (liquid) => WIKI_ALLOWED_LIQUIDS.includes(liquid)
    );

    if (!allowedLiquids.length) {
      return {};
    }

    return {
      allowedLiquids,
      liquidCapacity: parsedItem.liquidData.maxLiquid,
    };
  }

  protected formatScrapResults(parsedItem: ParsedItem) {
    return parsedItem.salvageData.items.map((entry) => ({
      item: this.getItemNameByRowName(entry.itemRowName),
      chanceToDrop: entry.chanceToDrop,
      quantityMin: entry.quantityMin,
      quantityMax: entry.quantityMax,
    }));
  }

  protected formatGearData(parsedItem: ParsedItem) {
    if (!parsedItem.equipmentData.isEquipment) {
      return {};
    }

    return {
      gearSlot: WIKI_GEAR_SLOTS[parsedItem.equipmentData.slot] ?? 'UNKNOWN',
      gearArmor: formatNumber(parsedItem.equipmentData.armorBonus),
      gearCapacity: formatNumber(parsedItem.equipmentData.containerCapacity),
      gearWeightReduction: formatNumber(
        parsedItem.equipmentData.containerWeightReduction
      ),
    };
  }

  protected formatWeaponData(parsedItem: ParsedItem) {
    const { weaponData } = parsedItem;
    if (!weaponData.isWeapon) {
      return {};
    }

    return {
      weaponType: weaponData.isMelee ? 'Melee' : 'Ranged',
      weaponDamage: weaponData.damagePerHit,
      weaponAmmoItem: weaponData.requireAmmo
        ? this.getItemNameByRowName(weaponData.ammoItemRowName)
        : undefined,
      weaponAmmoCount: weaponData.requireAmmo
        ? weaponData.magazineSize
        : undefined,
      weaponSecondaryAction: weaponData.secondaryAttack,
    };
  }

  protected formatConsumableData(parsedItem: ParsedItem) {
    const { consumableData } = parsedItem;
    if (!consumableData.isConsumable) {
      return {};
    }

    return {
      consumableHungerFill: formatNumber(consumableData.hungerFill),
      consumableFatigueFill: formatNumber(consumableData.fatigueFill),
      consumableThirst: formatNumber(consumableData.thirstFill),
      consumableRadiation: formatNumber(consumableData.radiationChange),
      consumableAppliesStatus: consumableData.buffsToAdd.map(
        (s) => WIKI_STATUSES[s] ?? s
      ),
      consumableRemovesStatus: consumableData.buffsToRemove.map(
        (s) => WIKI_STATUSES[s] ?? s
      ),
      timeToConsume: formatNumber(consumableData.timeToConsume),
    };
  }

  protected formatDurabilityData(parsedItem: ParsedItem) {
    const { durabilityData } = parsedItem;
    if (!durabilityData.canLoseDurability) {
      return {};
    }

    return {
      durability: parsedItem.durabilityData.maxDurability,
      repairItem: this.getItemNameByRowName(
        parsedItem.durabilityData.repairItem?.itemRowName
      ),
      repairAmount: parsedItem.durabilityData.repairItem?.quantityMax,
    };
  }

  protected formatDecayData(parsedItem: ParsedItem) {
    const { cookableData } = parsedItem;
    if (!cookableData.canDecay) {
      return {};
    }

    return {
      decayLimit: parsedItem.durabilityData.maxDurability,
      decayToItem: this.getItemNameByRowName(cookableData.decayToItemRowName),
    };
  }

  protected formatCookingData(parsedItem: ParsedItem) {
    const { cookableData } = parsedItem;

    if (cookableData.isCookware) {
      return { cookingIsCookware: true };
    }

    if (cookableData.canBeCooked) {
      return {
        cookingRawItem: this.getItemNameByRowName(
          cookableData.cookableStates?.rawItemRowName
        ),
        cookingCookedItem: this.getItemNameByRowName(
          cookableData.cookableStates?.cookedItemRowName
        ),
        cookingBurnedItem: this.getItemNameByRowName(
          cookableData.cookableStates?.burnedItemRowName
        ),
      };
    }
  }

  protected isIgnored(parsedItem: ParsedItem) {
    return WIKI_IGNORED_ITEMS.includes(parsedItem.rowName);
  }

  protected getItemNameByRowName(rowName?: string) {
    const item = this.parsedItemsMap[rowName ?? 'UNKNOWN'];
    if (!item) {
      return undefined;
    }

    return this.formatItemName(item);
  }
}
