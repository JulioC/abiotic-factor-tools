import {
  AssetHandle,
  DataTableIdentifier,
  DataTableRowHandle,
  StringHandle,
} from '../UnrealEngine';

export interface ItemTableRow {
  // Texts
  ItemName: StringHandle;
  ItemDescription: StringHandle;
  ItemFlavorText: StringHandle;

  // Verbs for the four interactions
  ToInteractWith_Text: StringHandle;
  ToLongInteractWith_Text: StringHandle;
  ToPackage_Text: StringHandle;
  ToLongPackage_Text: StringHandle;

  // Inventory icon reference
  InventoryIcon: AssetHandle;

  // Stats
  StackSize: number;
  Weight: number;

  // Deploy orientations, see: E_DeployableOrientations
  PlacementOrientationsAllowed: string;

  // Durability
  CanLoseDurability: boolean;
  MaxItemDurability: number;
  // Is this applied to items only?
  ChanceToLoseDurability: number;
  RepairItem: ItemTableRowRepairItem;

  TryPlaceInHotbar: boolean;

  // Specific types
  IsWeapon: boolean;
  WeaponData: ItemTableRowWeaponData;
  EquipmentData: ItemTableRowEquipmentData;
  SalvageData: DataTableRowHandle;
  ConsumableData: ItemTableRowConsumableData;
  CookableData: ItemTableRowCookableData;
  LiquidData: ItemTableRowLiquidData;

  // ???
  // See: DT_ItemUseFlags
  ItemUseFlags?:
    | DataTableRowHandle[]
    | null;
  GameplayTags?: string[] | null;
  FPAnimationData: DataTableRowHandle;
  FPAttachSocket: string;
  TPAttachSocket: string;

  // Models, classes, etc...
  ItemClass: AssetHandle;
  WorldStaticMesh: AssetHandle;
  Scale_WorldMesh: number;
  Scale_FirstPersonMesh: number;
  Scale_TPHeldMesh: number;
  WorldSkeletalMesh: AssetHandle;
  WorldSkeletalMeshAnimation: AssetHandle;
  DeployedItemClass: AssetHandle;
  DeployHologramMesh: AssetHandle;
  StrippedFromBuild: boolean;
  TextureVariant: DataTableRowHandle;
}
export interface ItemTableRowRepairItem {
  ItemDataTable: DataTableRowHandle;
  QuantityMin: number;
  QuantityMax: number;
  ChanceToDrop: number;
}
export interface ItemTableRowWeaponData {
  Melee: boolean;
  MeleeSwingData: DataTableRowHandle;
  SkeletalData: ItemTableRowSkeletalData;
  FireSound: DataTableIdentifier;
  OptionalProjectileToFire: AssetHandle;
  TimeBetweenShots: number;
  MaximumHitscanRange: number;
  DamagePerHit: number;
  BulletSpread_Min: number;
  BulletSpread_Max: number;
  DamageType_Hitscan: DataTableIdentifier;
  RecoilAmount: number;
  PelletCount: number;
  MagazineSize: number;
  RequireAmmo: boolean;
  AmmoType: DataTableRowHandle;
  TPAnimationData: DataTableRowHandle;
  SecondaryAttack: string;
  LoudnessOnPrimaryUse: number;
  LoudnessOnSecondaryUse: number;
  AmmoVisuals: ItemTableRowAmmoVisuals;
  UnderwaterState: string;
}
export interface ItemTableRowSkeletalData {
  WeaponSkeletalMesh: AssetHandle;
  WeaponAnimationData: DataTableRowHandle;
}
export interface ItemTableRowAmmoVisuals {
  LoadedAmmoMesh: AssetHandle;
  LoadedAmmoVisuals?: unknown[] | null;
}
export interface ItemTableRowEquipmentData {
  EquipSlot: string;
  CanAutoEquip: boolean;
  ArmorBonus: number;
  DamageMitigationType?: unknown[] | null;
  IsContainer: boolean;
  ContainerCapacity: number;
  ContainerWeightReduction: number;
  InventoryPlaceSound: AssetHandle;
  SetBonus: ItemTableRowSetBonus;
}
export interface ItemTableRowSetBonus {
  RowName: string;
}
export interface ItemTableRowConsumableData {
  TimeToConsume: number;
  HungerFill: number;
  ThirstFill: number;
  FatigueFill: number;
  ContinenceFill: number;
  SanityFill: number;
  TemperatureChange: number;
  RadiationChange: number;
  HealthChange: number;
  ArmorChange: number;
  BuffsToAdd?: string[] | null;
  BuffsToRemove?: string[] | null;
  ConsumableTag: ItemTableRowConsumableTag;
  ConsumedAction: string;
  Radioactivity: number;
}
export interface ItemTableRowConsumableTag {
  TagName: string;
}
export interface ItemTableRowCookableData {
  IsCookware: boolean;
  CanBeCooked: boolean;
  CookedItem: DataTableRowHandle;
  BurnedItem: DataTableRowHandle;
  TimeToCookBaseline: number;
  TimeToBurnBaseline: number;
  FarmableDataRow: ItemTableRowSetBonus;
  RequiresBaking: boolean;
  StartingPortions: number;
  CanItemDecay: boolean;
  ItemDecayTemperature: string;
  DecayToItem: DataTableRowHandle;
}
export interface ItemTableRowLiquidData {
  MaxLiquid: number;
  AllowedLiquids?: string[] | null;
  PercentageLiquidToStartWith: number;
  LiquidToStartWith?: string[] | null;
}
