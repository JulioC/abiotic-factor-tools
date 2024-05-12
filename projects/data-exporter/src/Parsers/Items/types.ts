export type ParsedItem = {
  rowName: string;

  name: string;
  description?: string;
  flavorText?: string;
  inventoryIconFilename: string;

  stackSize: number;
  weight: number;
  radioactivity: number;

  researchMaterial?: string;

  durabilityData: ParsedItemDurabilityData;
  weaponData: ParsedItemWeaponData;
  equipmentData: ParsedItemEquipmentData;
  salvageData: ParsedItemSalvageData;
  consumableData: ParsedItemConsumableData;
  cookableData: ParsedItemCookableData;
  liquidData: ParsedItemLiquidData;
  deployableData: ParsedItemDeployableData;

  itemUseFlags: string[];
  gameplayTags: string[];
};

export type ParsedItemWeaponData = {
  isWeapon: boolean;

  isMelee: boolean;
  timeBetweenShots: number;
  maximumHitscanRange: number;
  damagePerHit: number;
  bulletSpreadMin: number;
  bulletSpreadMax: number;
  recoilAmount: number;
  pelletCount: number;
  magazineSize: number;
  requireAmmo: boolean;
  ammoItemRowName: string;
  secondaryAttack: string;
  loudnessOnPrimaryUse: number;
  loudnessOnSecondaryUse: number;
  underwaterState: string;
};

export type ParsedItemEquipmentData = {
  isEquipment: boolean;
  slot: string;
  canAutoEquip: boolean;
  armorBonus: number;
  damageMitigationType: unknown[]; // TODO
  containerCapacity: number;
  containerWeightReduction: number;
  isContainer: boolean;
  setBonus: string;
};

export type ParsedItemDurabilityData = {
  canLoseDurability: boolean;
  maxDurability: number;
  chanceToLoseDurability: number;
  repairItem?: ParsedRepairItem;
};

export type ParsedRepairItem = {
  itemRowName: string;
  quantityMin: number;
  quantityMax: number;
};

export type ParsedLootTableEntry = {
  itemRowName: string;
  quantityMin: number;
  quantityMax: number;
  chanceToDrop: number;
};

export type ParsedItemSalvageData = {
  isSalvageable: boolean;
  items: ParsedLootTableEntry[];
};

export type ParsedItemConsumableData = {
  timeToConsume: number;
  hungerFill: number;
  thirstFill: number;
  fatigueFill: number;
  continenceFill: number;
  sanityFill: number;
  temperatureChange: number;
  radiationChange: number;
  healthChange: number;
  armorChange: number;
  buffsToAdd: string[];
  buffsToRemove: string[];
  consumableTag?: string;
  consumedAction?: string;
  isConsumable: boolean;
};

export type ParsedItemCookableData = {
  isCookware: boolean;
  canBeCooked: boolean;
  timeToCookBaseline: number;
  timeToBurnBaseline: number;
  farmableDataRow?: string;
  requiresBaking: boolean;
  canDecay: boolean;
  decayTemperature: string;
  decayToItemRowName?: string;

  cookableStates?: ParsedItemCookableStates;
};

export type ParsedItemLiquidData = {
  isLiquidContainer: boolean;
  maxLiquid: number;
  allowedLiquids: string[];
  startLiquidPercentage: number;
  startLiquid: string[];
};

export type ParsedItemDeployableData = {
  isDeployable: boolean;
  placementOrientationsAllowed: string;
  primaryInteraction?: string;
  primaryInteractionLong?: string;
  secondaryInteraction?: string;
  secondaryInteractionLong?: string;
};

export type ParsedItemCookableStates = {
  rawItemRowName: string;
  cookedItemRowName: string;
  burnedItemRowName: string;
};
