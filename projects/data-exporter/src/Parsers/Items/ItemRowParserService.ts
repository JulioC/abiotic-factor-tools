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

      description: await this.stringsService.getString(
        itemRow.ItemDescription_38_E5F7B38A4F3C41EB9DA52CA14654D303
      ),
      flavorText: await this.stringsService.getString(
        itemRow.ItemFlavorText_39_12D05DD74EA145A5E7D1159C7F326177
      ),

      inventoryIconFilename: await this.parseInventoryIconFilename(itemRow),

      stackSize: itemRow.StackSize_47_D124F11B4B6D9766B2B33699795845A9,
      weight: itemRow.Weight_119_CE7DB430417207921D739CAF458D4D7C,
      radioactivity:
        itemRow.ConsumableData_84_757B6B114FF23016981BEF888A31C670
          .Radioactivity_43_0EF079AA43B77C98214300AD0CFB2F74,

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
      gameplayTags:
        itemRow.GameplayTags_138_C253BD3B4A4A21569AFC138CF0DDB59A ?? [],
    };
  }

  protected async parseName(rowName: string, itemRow: ItemTableRow) {
    const name = await this.stringsService.getString(
      itemRow.ItemName_51_B88648C048EE5BC2885E4E95F3E13F0A
    );
    return name?.replace('{CookedState}', 'Cooked') ?? `UNKNOWN (${rowName})`;
  }

  protected async parseInventoryIconFilename(itemRow: ItemTableRow) {
    try {
      return await this.objectsService.parseObjectPath(
        itemRow.InventoryIcon_50_57AF4D5548B1985502D209AB8854A797.AssetPathName,
        'png'
      ).filename;
    } catch {
      return 'UNKNOWN';
    }
  }

  protected async parseResearchMaterial(itemRow: ItemTableRow) {
    const gameplayTags =
      itemRow.GameplayTags_138_C253BD3B4A4A21569AFC138CF0DDB59A ?? [];
    const researchMaterial = gameplayTags
      .find((t) => t.startsWith('Item.Material.'))
      ?.replace('Item.Material.', '');
    return researchMaterial;
  }

  protected async parseDurabilityData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemDurabilityData> {
    return {
      canLoseDurability:
        itemRow.CanLoseDurability_29_42EA515F4AC1EC69D8480DB36C01D5E1,
      maxDurability:
        itemRow.MaxItemDurability_31_6EBCEFC943F9E85DE9350BBC0E249447,
      chanceToLoseDurability:
        itemRow.ChanceToLoseDurability_97_DF967C464092E2E6AEEBFE84C536ACAB,
      repairItem: await this.parseRepairItem(itemRow),
    };
  }

  protected async parseRepairItem(
    itemRow: ItemTableRow
  ): Promise<ParsedRepairItem> {
    const rawRepairItem =
      itemRow.RepairItem_106_C2E89B0B4B7F39FC3B2B828BBD13A391;
    return {
      itemRowName:
        rawRepairItem.ItemDataTable_16_C430AEEE4D16DC471206DBBAA9F6796F.RowName,
      quantityMin:
        rawRepairItem.QuantityMin_13_08A3850648D7ADA008D57FB0855F1474,
      quantityMax:
        rawRepairItem.QuantityMax_14_6E8D8DF64637C2DD2E9DA59CBF7FAADF,
    };
  }

  protected async parseWeaponData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemWeaponData> {
    const weaponData = itemRow.WeaponData_61_3C29CF6C4A7F9DD435F9318FEE4B033D;
    return {
      isWeapon: itemRow.IsWeapon_63_57F6A703413EA260B1455CA81F2D4911,

      isMelee: weaponData.Melee_1_AB17935A4F944DCEEB1AB3A5B598E702,

      damagePerHit: weaponData.DamagePerHit_16_F95199D1425C37191C55CDA0DC07BDDC,
      maximumHitscanRange:
        weaponData.MaximumHitscanRange_26_F36D29CA48831A6C3AD49EB94F5D2BE2,
      timeBetweenShots:
        weaponData.TimeBetweenShots_8_71ACC9414B36314DEF34B3A54649941C,
      bulletSpreadMin:
        weaponData.BulletSpread_Min_38_08ADC0BA4BEA02135BE0438A60AE5725,
      bulletSpreadMax:
        weaponData.BulletSpread_Max_39_4AE2E5744A934A3FFCEC2A9D7A1A6963,
      recoilAmount: weaponData.RecoilAmount_42_85AFA9834A1CABF8183C088D857840EE,
      pelletCount: weaponData.PelletCount_77_4504318146345E7029C78790B317E074,

      magazineSize: weaponData.MagazineSize_57_E890A3944240BB8D07EF0B9251F1FBD4,
      requireAmmo: weaponData.RequireAmmo_85_8BB1C1954D2A83BB1994549DDEEBA306,
      ammoItemRowName:
        weaponData.AmmoType_54_D19EDD9E48E4252D492757BFAAC23A73.RowName,

      secondaryAttack: await this.enumsService.getEnumDisplayName(
        weaponData.SecondaryAttack_82_0ADE2DC74388F34F125F0DB6D9AAC1CD
      ),

      loudnessOnPrimaryUse:
        weaponData.LoudnessOnPrimaryUse_74_7829648A4C3F44A62DCA09B3817DF796,
      loudnessOnSecondaryUse:
        weaponData.LoudnessOnSecondaryUse_73_89AB59C84EBC77DEB5DD2C9C88E9C237,

      underwaterState: await this.enumsService.getEnumDisplayName(
        weaponData.UnderwaterState_95_972463794CBCCEA48AC987A7FA4C0118
      ),
    };
  }

  protected async parseEquipmentData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemEquipmentData> {
    const equipmentData =
      itemRow.EquipmentData_100_576D05464F36104AFE501B878255E318;

    // EquipSlot is set to backpack for non-equipment items
    const isEquipment =
      equipmentData.EquipSlot_5_7DAF59D54ADD37B8594D91A65C47292E !==
      'E_InventorySlotType::NewEnumerator1';

    return {
      isEquipment,
      slot: await this.enumsService.getEnumDisplayName(
        equipmentData.EquipSlot_5_7DAF59D54ADD37B8594D91A65C47292E
      ),
      canAutoEquip:
        equipmentData.CanAutoEquip_7_8C31C7864D1203170E1ED4B7CD8D86B7,

      armorBonus: equipmentData.ArmorBonus_18_84B6DFE74803168AF5603BB0EEE8EA4B,

      // TODO: figure this out
      damageMitigationType:
        equipmentData.DamageMitigationType_26_A9588042478434D0454984B9FC9DDD3B ??
        [],

      isContainer:
        equipmentData.IsContainer_13_34FE7C954474C022C6AEE48F5F8BA8AC,
      containerCapacity:
        equipmentData.ContainerCapacity_20_DC743D864AC6607638E3D2B6D044F42D,
      containerWeightReduction:
        equipmentData.ContainerWeightReduction_37_EDAD1C7B4B78383E02330C9186D35A2F,

      // SetBonus is not defined in game files
      // Known values: None, set_carapace, set_forge, set_labrat, set_makeshift
      setBonus:
        equipmentData.SetBonus_47_CB28322D474A62221039CC98B6274502.RowName,
    };
  }

  protected async parseSalvageData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemSalvageData> {
    const rawSalvageData = await this.dataTablesService.getRow<SalvageTableRow>(
      itemRow.SalvageData_81_DA79A7E04A8ED68D8B7D2F912AF0AEBB
    );

    const salvageItems =
      rawSalvageData?.SalvageDropItems_4_6F67F05F401125FAC788E4B1800CBC93;
    const items = salvageItems?.map<ParsedLootTableEntry>((salvageItem) => ({
      itemRowName:
        salvageItem.ItemDataTable_16_C430AEEE4D16DC471206DBBAA9F6796F.RowName,
      quantityMin: salvageItem.QuantityMin_13_08A3850648D7ADA008D57FB0855F1474,
      quantityMax: salvageItem.QuantityMax_14_6E8D8DF64637C2DD2E9DA59CBF7FAADF,
      chanceToDrop:
        salvageItem.ChanceToDrop_12_45BEC64444296AFBC69AD280F4D2BEDB,
    }));

    return {
      isSalvageable: !!items?.length,
      items: items ?? [],
    };
  }

  protected async parseConsumableData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemConsumableData> {
    const consumableData =
      itemRow.ConsumableData_84_757B6B114FF23016981BEF888A31C670;
    const partial = {
      timeToConsume:
        consumableData.TimeToConsume_32_8034526445B400D3948365AF202D7D0E,

      hungerFill: consumableData.HungerFill_5_0F5B3F3B46E595BD90371AA8D9C70A99,
      thirstFill: consumableData.ThirstFill_11_5F6F7BB94AF9FA42F990CF96FBE5B478,
      fatigueFill:
        consumableData.FatigueFill_12_E90E1C3846E743D359DFC29B6B932BBC,
      continenceFill:
        consumableData.ContinenceFill_13_2B1EC44C41E46984971A9F95E6CFB3E7,

      temperatureChange:
        consumableData.TemperatureChange_14_9C12C233407D10A07EE1828308D28927,
      radiationChange:
        consumableData.RadiationChange_28_A69AB0FF4F262573EB722E82ACC010CE,

      buffsToAdd:
        consumableData.BuffsToAdd_23_0A2DBBC447537E9C754279951429DB87 ?? [],
      buffsToRemove:
        consumableData.BuffsToRemove_25_15B5DEA242CC72F8FE9C3C8CFD670842 ?? [],

      consumedAction:
        consumableData.ConsumedAction_40_42D12BB34169784F3396DAB8CEC3ACD9,
      consumableTag:
        consumableData.ConsumableTag_37_FA7E5213470AE102881FF89660A5C58A
          .TagName,

      // Unused
      sanityFill: consumableData.SanityFill_15_EA5C94304AEC5881C4A2C5A262CE916A,
      healthChange:
        consumableData.HealthChange_17_42D5968640F9B02C6414BDBDA2196B6B,
      armorChange:
        consumableData.ArmorChange_19_16C741BA4535E6F6100D07B69FC1A0EA,
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
    const cookableData =
      itemRow.CookableData_94_7EFD1F0A4A7EFB44D3D8B9B14581BF36;
    return {
      isCookware: cookableData.IsCookware_36_E60FF3174809E5F04F20E290DEF53B8C,
      canBeCooked: cookableData.CanBeCooked_1_F8283E94449BB680D9E4D0B6435E50F2,
      requiresBaking:
        cookableData.RequiresBaking_39_DBBD2AB047509D0C3B49169C342B3676,

      cookableStates: cookableStatesMap[rowName],

      timeToCookBaseline:
        cookableData.TimeToCookBaseline_26_EC459D4A450678325EB8409C755D7470,
      timeToBurnBaseline:
        cookableData.TimeToBurnBaseline_29_A879BF574759AE7B242961AC5B2B62BC,

      // This is used for both seeds and produces
      farmableDataRow:
        cookableData.FarmableDataRow_48_7F52477E453E35CB6673A6914103179E
          .RowName,

      canDecay: !!cookableData.CanItemDecay_41_ED9D0360494304403FBDFAB9B4D33D35,
      decayTemperature: await this.enumsService.getEnumDisplayName(
        cookableData.ItemDecayTemperature_47_E057BEE84D43178AA60FD59503C79701
      ),
      decayToItemRowName:
        cookableData.DecayToItem_46_BC887D114948DE4082DD63BC166B5DE2.RowName,
    };
  }

  protected async parseLiquidData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemLiquidData> {
    const liquidData = itemRow.LiquidData_110_4D07F09C483C1E65B39024ABC7032FA0;
    return {
      isLiquidContainer:
        !!liquidData.AllowedLiquids_7_1DF3EB8C43F49DA3A1E4A2AF908148D3?.length,

      maxLiquid: liquidData.MaxLiquid_16_80D4968B4CACEDD3D4018E87DA67E8B4,
      allowedLiquids: await Promise.all(
        liquidData.AllowedLiquids_7_1DF3EB8C43F49DA3A1E4A2AF908148D3?.map(
          (s: string) => this.enumsService.getEnumDisplayName(s)
        ) ?? []
      ),
      startLiquidPercentage:
        liquidData.PercentageLiquidToStartWith_11_835A4C4F440C319874D3EFA75CAFA4C5,
      startLiquid: await Promise.all(
        liquidData.LiquidToStartWith_15_F7D753A24D2130B92AF312AB9192AD9C?.map(
          (s: string) => this.enumsService.getEnumDisplayName(s)
        ) ?? []
      ),
    };
  }

  protected async parseDeployableData(
    itemRow: ItemTableRow
  ): Promise<ParsedItemDeployableData> {
    return {
      isDeployable:
        !!itemRow.DeployedItemClass_33_2CB440284F44C59CE124E4A806544272
          .AssetPathName,

      placementOrientationsAllowed: await this.enumsService.getEnumDisplayName(
        itemRow.PlacementOrientationsAllowed_122_75894D7C4B93F103C06AB18421167757
      ),

      primaryInteraction: await this.stringsService.getString(
        itemRow.ToInteractWith_Text_66_C2148289464D5AAA4D19BBA13F15FE41
      ),
      primaryInteractionLong: await this.stringsService.getString(
        itemRow.ToLongInteractWith_Text_68_4FBE88F341B6A020E3216CA026A1E4E8
      ),
      secondaryInteraction: await this.stringsService.getString(
        itemRow.ToPackage_Text_71_5094104748FCB4BD2F90C99A2C4C49A8
      ),
      secondaryInteractionLong: await this.stringsService.getString(
        itemRow.ToLongPackage_Text_72_CB77853E49960F43E6422C90DC967508
      ),
    };
  }

  protected async parseItemUseFlags(itemRow: ItemTableRow) {
    const rawItemUseFlags =
      itemRow.ItemUseFlags_127_753F84CF4AE10832188BD88A31F94F87 ?? [];
    const itemUseFlags = await Promise.all(
      rawItemUseFlags.map((flag) => this.dataTablesService.getRow(flag))
    );
    // TODO: figure out how to deal with these flags
    const debug = false;
    if (debug && itemUseFlags.length) console.log(itemUseFlags);
    return [];
  }
}
