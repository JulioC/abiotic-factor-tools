export const WIKI_IGNORED_ITEMS: string[] = [
  // Same as the `heater`, but doesn't lose durability and doesn't despawn
  'tutorialheater',
  // Same as the `money`, apparently no differences
  'money_stack',
  // This is what glowstick becomes when they are thrown, should not appear in inventory
  'Deployable_Glowstick',
  // Name is duplicated with food_peccary_leg_burnt, this one appears to be unused
  'food_roastpecc_burnt',
  // Some items have unique variants, we'll need to add them manually
  'Abstract Square Painting (Regular)',
  'Abstract Square Painting (Large)',
  'Abstract Square Painting (Fancy)',
  'Abstract Square Painting  (Large Fancy)',
  'Colorful Abstract Painting (Regular)',
  'Colorful Abstract Painting (Fancy)',
  'Painting of a Man (Regular)',
  'Painting of a Man (Fancy)',
  'Arcade Machine',
  'Poster',
  // Developer or unused items
  'UNKNOWN (Plant Antelight)',
  'UNKNOWN (Plant VelcroPlant)',
  'UNKNOWN (Plant SpaceLettuce)',
  'UNKNOWN (Plant Egg)',
  'UNKNOWN (Plant RopePlant)',
  'UNKNOWN (Plant Super Tomato)',
  'UNKNOWN (Plant Greyeb)',
  'UNKNOWN (Plant Wheat)',
  'UNKNOWN (Plant Tomato)',
  'UNKNOWN (Plant Corn)',
  'ITEM MISSING',
  'Chemistry Bench',
  'Hard Drive',
  '40mm High Explosive',
];

/**
 * Override some item names so they don't conflict in the wiki
 */
export const WIKI_ITEM_NAME_OVERRIDES: Record<string, string> = {
  Deployable_PottedPlant_01: 'Potted Plant 1',
  Deployable_PottedPlant_02: 'Potted Plant 2',
  Deployable_PottedPlant_03: 'Potted Plant 3',
  Deployable_PottedPlant_04: 'Potted Plant 4',
  Deployable_PottedPlant_05: 'Potted Plant 5',
  Deployable_PottedPlant_06: 'Potted Plant 6',
  Deployable_DiningTable_Vintage_01: 'Vintage Dining Table 1',
  Deployable_DiningTable_Vintage_02: 'Vintage Dining Table 2',
  Painting_Landscape: 'Abstract Square Painting (Regular)',
  Painting_Landscape_Large: 'Abstract Square Painting (Large)',
  Painting_Landscape_Fancy: 'Abstract Square Painting (Fancy)',
  Painting_Landscape_Large_Fancy: 'Abstract Square Painting  (Large Fancy)',
  Painting_Square: 'Colorful Abstract Painting (Regular)',
  Painting_Square_Fancy: 'Colorful Abstract Painting (Fancy)',
  Painting_Vertical: 'Painting of a Man (Regular)',
  Painting_Vertical_Fancy: 'Painting of a Man (Fancy)',
  soup_solder: 'Solder (Soup)',
  solder: 'Solder (Material)',
  trinket_petrock: 'Pet Rock (Trinket)',
  petrock: 'Pet Rock (Pickup)',
};

export const WIKI_ALLOWED_LIQUIDS = [
  'Soup',
  'TaintedWater',
  'Water',
  'Antejuice',
];

export const WIKI_GEAR_SLOTS: Record<string, string> = {
  EquipmentSlot_Wristwatch: 'Wristwatch',
  EquipmentSlot_Hacker: 'Hacking Device',
  EquipmentSlot_Headlamp: 'Headlamp',
  EquipmentSlot_Head: 'Head Armor',
  EquipmentSlot_Trinket: 'Trinket',
  EquipmentSlot_Arms: 'Arm Armor',
  EquipmentSlot_Shield: 'Off-hand Shield',
  EquipmentSlot_Torso: 'Chest Armor',
  EquipmentSlot_Legs: 'Leg Armor',
  EquipmentSlot_Suit: 'Full Body Suit',
  EquipmentSlot_Backpack: 'Backpack',
};

export const WIKI_STATUSES: Record<string, string> = {
  Buff_AirtightSeal: 'Airtight Seal',
  // Buff_BigBrain: "",
  // Buff_Biometric: "",
  // Buff_Biometric_t2: "",
  // Buff_BionicLegs: "",
  // Buff_Bodacious: "",
  // Buff_BrainDrain: "",
  // Buff_BreacherHelmet: "",
  Buff_Caffeinated: 'Caffeinated',
  Buff_CarbuncleCrown: 'King of Carbuncles',
  Buff_Devoted: 'Devoted',
  // Buff_Faceshield: "",
  // Buff_FasterCorpseGib: "",
  Buff_FireProximitySuit: 'Fire Proximity Suit',
  // Buff_FleshyTemptation: "",
  // Buff_FleshyTemptation_T2: "",
  Buff_GravityCube: 'Gravity Cube',
  Buff_HardHat: 'Hard Hat',
  Buff_HazmatSuit: 'Hazmat Suit',
  // Buff_HeightenedSenses: "",
  // Buff_LabMask: "",
  Buff_LeadVest: 'Lead Vest',
  // Buff_LightFooted: "",
  // Buff_LivingOffLand: "",
  Buff_MedicHelmet: 'Medic',
  // Buff_MegaAnte: "",
  // Buff_MushroomHelmet: "",
  // Buff_QuickReflexes: "",
  Buff_RadioPack: 'Radio Pack',
  Buff_Radpills: 'Rad Resistant',
  // Buff_ResearchPack: "",
  // Buff_SouperSatisfied: "",
  Buff_SplatterReduction: 'Splatter Guard',
  Buff_SplintedLeg: 'Splinted Limb',
  // Buff_SugarHigh: "",
  // Buff_SweetTooth: "",
  Buff_SyringeHeal: 'Health Syringe',
  // Debuff_ArmBroken: "",
  // Debuff_ArmFracture: "",
  // Debuff_ArmSprain: "",
  // Debuff_BrokenLegs: "",
  Debuff_Frost: 'Chilly',
  // Debuff_HeatRate: "",
  // Debuff_LegBroken: "",
  // Debuff_LegFracture: "",
  // Debuff_LegSprain: "",
  Debuff_Poisoned: 'Poisoned',
  Debuff_Sick: 'Sick',
  Debuff_Spores: 'Lung Infection',
  Debuff_Stinky: 'Stinky',
  Debuff_StuffySuit: 'Stuffy Suit',
};

export const WIKI_CATEGORIES: Record<string, string> = {
  Resource: 'Resources and Sub-components',
  Construction: 'Furniture and Benches',
  Tools: 'Tools',
  Electricity: 'Light and Power',
  Defense: 'Base defense',
  Weapon: 'Weapons and Ammo',
  Gear: 'Armor and Gear',
  Health: 'Health and Medical',
  Food: 'Food and Cooking',
  Farming: 'Farming',
  Travel: 'Travel and Vehicles',
};
