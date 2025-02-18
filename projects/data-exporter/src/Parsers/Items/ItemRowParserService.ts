import { injectable } from 'tsyringe';
import { ItemTableRow, SalvageTableRow } from '../../Game';
import {
  DataTablesService,
  EnumsService,
  ObjectsService,
  StringsService,
} from '../../UnrealEngine';
import {
  ParsedItem,
  ParsedItemConsumableData,
  ParsedItemCookableData,
  ParsedItemCookableStates,
  ParsedItemDeployableData,
  ParsedItemDurabilityData,
  ParsedItemEquipmentData,
  ParsedItemLiquidData,
  ParsedItemSalvageData,
  ParsedItemWeaponData,
  ParsedLootTableEntry,
  ParsedRepairItem,
} from './types';

/**
 * Parser for Item DataTable rows
 * All game-specific logic should be done here
 * The ParsedItem should be as human-readable as possible
 */
@injectable()
export class ItemRowParserService {
  constructor(
    protected stringsService: StringsService,
    protected enumsService: EnumsService,
    protected dataTablesService: DataTablesService,
    protected objectsService: ObjectsService
  ) {}

  async parse(
    rowName: string,
    itemRow: ItemTableRow,
    cookableStatesMap: Record<string, ParsedItemCookableStates>
  ): Promise<ParsedItem> {
    return {
      rowName,

      name: await this.parseName(rowName, itemRow),

      description: await this.stringsService.getString(itemRow.ItemDescription),
      flavorText: await this.stringsService.getString(itemRow.ItemFlavorText),

      inventoryIconFilename: await this.parseInventoryIconFilename(itemRow),

      stackSize: itemRow.StackSize,
      weight: itemRow.Weight,
      radioactivity: itemRow.ConsumableData.Radioactivity,

      researchMaterial: await this.parseResearchMaterial(itemRow),

      durabilityData: await this.parseDurabilityData(itemRow),
      weaponData: await this.parseWeaponData(itemRow),
      equipmentData: await this.parseEquipmentData(itemRow),
      salvageData: await this.parseSalvageData(itemRow),
      consumableData: await this.parseConsumableData(itemRow),
      cookableData: await this.parseCookableData(
        rowName,
        itemRow,
        cookableStatesMap
      ),
      liquidData: await this.parseLiquidData(itemRow),
      deployableData: await this.parseDeployableData(itemRow),

      itemUseFlags: await this.parseItemUseFlags(itemRow),
      gameplayTags: itemRow.GameplayTags ?? [],
    };
  }

  protected async parseName(rowName: string, itemRow: ItemTableRow) {
    const name = await this.stringsService.getString(itemRow.ItemName);
    return name?.replace('{CookedState}', 'Cooked') ?? `UNKNOWN (${rowName})`;
  }

  protected async parseInventoryIconFilename(itemRow: ItemTableRow) {
    try {
      return await this.objectsService.parseObjectPath(
        itemRow.InventoryIcon.AssetPathName,
        'png'
      ).filename;
    } catch {
      return 'UNKNOWN';
    }
  }

  protected async parseResearchMaterial(itemRow: ItemTableRow) {
    const gameplayTags = itemRow.GameplayTags ?? [];
    const researchMaterial = gameplayTags
      .find((t) => t.startsWith('Item.Material.'))
      ?.replace('Item.Material.', '');
    return researchMaterial;
  }

  protected async parseDurabilityData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemDurabilityData> {
    return {
      canLoseDurability: itemRow.CanLoseDurability,
      maxDurability: itemRow.MaxItemDurability,
      chanceToLoseDurability: itemRow.ChanceToLoseDurability,
      repairItem: await this.parseRepairItem(itemRow),
    };
  }

  protected async parseRepairItem(
    itemRow: ItemTableRow
  ): Promise<ParsedRepairItem> {
    const rawRepairItem = itemRow.RepairItem;
    return {
      itemRowName: rawRepairItem.ItemDataTable.RowName,
      quantityMin: rawRepairItem.QuantityMin,
      quantityMax: rawRepairItem.QuantityMax,
    };
  }

  protected async parseWeaponData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemWeaponData> {
    const weaponData = itemRow.WeaponData;
    return {
      isWeapon: itemRow.IsWeapon,

      isMelee: weaponData.Melee,

      damagePerHit: weaponData.DamagePerHit,
      maximumHitscanRange: weaponData.MaximumHitscanRange,
      timeBetweenShots: weaponData.TimeBetweenShots,
      bulletSpreadMin: weaponData.BulletSpread_Min,
      bulletSpreadMax: weaponData.BulletSpread_Max,
      recoilAmount: weaponData.RecoilAmount,
      pelletCount: weaponData.PelletCount,

      magazineSize: weaponData.MagazineSize,
      requireAmmo: weaponData.RequireAmmo,
      ammoItemRowName: weaponData.AmmoType.RowName,

      secondaryAttack: await this.enumsService.getEnumDisplayName(
        weaponData.SecondaryAttack
      ),

      loudnessOnPrimaryUse: weaponData.LoudnessOnPrimaryUse,
      loudnessOnSecondaryUse: weaponData.LoudnessOnSecondaryUse,

      underwaterState: await this.enumsService.getEnumDisplayName(
        weaponData.UnderwaterState
      ),
    };
  }

  protected async parseEquipmentData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemEquipmentData> {
    const equipmentData = itemRow.EquipmentData;

    // EquipSlot is set to backpack for non-equipment items
    const isEquipment =
      equipmentData.EquipSlot !== 'E_InventorySlotType::NewEnumerator1';

    return {
      isEquipment,
      slot: await this.enumsService.getEnumDisplayName(equipmentData.EquipSlot),
      canAutoEquip: equipmentData.CanAutoEquip,

      armorBonus: equipmentData.ArmorBonus,

      // TODO: figure this out
      damageMitigationType: equipmentData.DamageMitigationType ?? [],

      isContainer: equipmentData.IsContainer,
      containerCapacity: equipmentData.ContainerCapacity,
      containerWeightReduction: equipmentData.ContainerWeightReduction,

      // SetBonus is not defined in game files
      // Known values: None, set_carapace, set_forge, set_labrat, set_makeshift
      setBonus: equipmentData.SetBonus.RowName,
    };
  }

  protected async parseSalvageData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemSalvageData> {
    const rawSalvageData = await this.dataTablesService.getRow<SalvageTableRow>(
      itemRow.SalvageData
    );

    const salvageItems = rawSalvageData?.SalvageDropItems;
    const items = salvageItems?.map<ParsedLootTableEntry>((salvageItem) => ({
      itemRowName: salvageItem.ItemDataTable.RowName,
      quantityMin: salvageItem.QuantityMin,
      quantityMax: salvageItem.QuantityMax,
      chanceToDrop: salvageItem.ChanceToDrop,
    }));

    return {
      isSalvageable: !!items?.length,
      items: items ?? [],
    };
  }

  protected async parseConsumableData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemConsumableData> {
    const consumableData = itemRow.ConsumableData;
    const partial = {
      timeToConsume: consumableData.TimeToConsume,

      hungerFill: consumableData.HungerFill,
      thirstFill: consumableData.ThirstFill,
      fatigueFill: consumableData.FatigueFill,
      continenceFill: consumableData.ContinenceFill,

      temperatureChange: consumableData.TemperatureChange,
      radiationChange: consumableData.RadiationChange,

      buffsToAdd: consumableData.BuffsToAdd ?? [],
      buffsToRemove: consumableData.BuffsToRemove ?? [],

      consumedAction: consumableData.ConsumedAction,
      consumableTag: consumableData.ConsumableTag.TagName,

      // Unused
      sanityFill: consumableData.SanityFill,
      healthChange: consumableData.HealthChange,
      armorChange: consumableData.ArmorChange,
    } satisfies Partial<ParsedItemConsumableData>;

    const isConsumable = !!(
      partial.hungerFill ||
      partial.thirstFill ||
      partial.fatigueFill ||
      partial.continenceFill ||
      partial.sanityFill ||
      partial.temperatureChange ||
      partial.radiationChange ||
      partial.healthChange ||
      partial.armorChange ||
      partial.buffsToAdd?.length ||
      partial.buffsToRemove?.length ||
      partial.consumableTag
    );

    return {
      ...partial,
      isConsumable,
    };
  }

  protected async parseCookableData(
    rowName: string,
    itemRow: ItemTableRow,
    cookableStatesMap: Record<string, ParsedItemCookableStates>
  ): Promise<ParsedItemCookableData> {
    const cookableData = itemRow.CookableData;
    return {
      isCookware: cookableData.IsCookware,
      canBeCooked: cookableData.CanBeCooked,
      requiresBaking: cookableData.RequiresBaking,

      cookableStates: cookableStatesMap[rowName],

      timeToCookBaseline: cookableData.TimeToCookBaseline,
      timeToBurnBaseline: cookableData.TimeToBurnBaseline,

      // This is used for both seeds and produces
      farmableDataRow: cookableData.FarmableDataRow.RowName,

      canDecay: !!cookableData.CanItemDecay,
      decayTemperature: await this.enumsService.getEnumDisplayName(
        cookableData.ItemDecayTemperature
      ),
      decayToItemRowName: cookableData.DecayToItem.RowName,
    };
  }

  protected async parseLiquidData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemLiquidData> {
    const liquidData = itemRow.LiquidData;
    return {
      isLiquidContainer: !!liquidData.AllowedLiquids?.length,

      maxLiquid: liquidData.MaxLiquid,
      allowedLiquids: await Promise.all(
        liquidData.AllowedLiquids?.map((s: string) =>
          this.enumsService.getEnumDisplayName(s)
        ) ?? []
      ),
      startLiquidPercentage: liquidData.PercentageLiquidToStartWith,
      startLiquid: await Promise.all(
        liquidData.LiquidToStartWith?.map((s: string) =>
          this.enumsService.getEnumDisplayName(s)
        ) ?? []
      ),
    };
  }

  protected async parseDeployableData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemDeployableData> {
    return {
      isDeployable: !!itemRow.DeployedItemClass.AssetPathName,

      placementOrientationsAllowed: await this.enumsService.getEnumDisplayName(
        itemRow.PlacementOrientationsAllowed
      ),

      primaryInteraction: await this.stringsService.getString(
        itemRow.ToInteractWith_Text
      ),
      primaryInteractionLong: await this.stringsService.getString(
        itemRow.ToLongInteractWith_Text
      ),
      secondaryInteraction: await this.stringsService.getString(
        itemRow.ToPackage_Text
      ),
      secondaryInteractionLong: await this.stringsService.getString(
        itemRow.ToLongPackage_Text
      ),
    };
  }

  protected async parseItemUseFlags(itemRow: ItemTableRow) {
    const rawItemUseFlags = itemRow.ItemUseFlags ?? [];
    const itemUseFlags = await Promise.all(
      rawItemUseFlags.map((flag) => this.dataTablesService.getRow(flag))
    );
    // TODO: figure out how to deal with these flags
    const debug = false;
    if (debug && itemUseFlags.length) console.log(itemUseFlags);
    return [];
  }
}
