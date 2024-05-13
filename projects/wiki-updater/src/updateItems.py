import json
import string
import time

from mwcleric import TemplateModifierBase
from mwparserfromhell.nodes import Template

summary = 'Automatically updating Infobox from game data'

def formatNumber(num):
    if num == 0:
        return ""
    else:
        return str(num)

def updateItems(site, data):
  # TemplateModifier is a generic framework for modifying templates
  # It will iterate through all pages containing at least one instance
  # of the specified template in the initialization call below and then
  # update every instance of the template in question with one batched edit per page
  class TemplateModifier(TemplateModifierBase):
    def update_template(self, template: Template):
      if self.current_page.namespace != 0:
          # don't do anything outside of the main namespace
          # for example, we don't want to modify template documentation or user sandboxes
          return

      itemName = self.current_page.name
      try:
        item = data[itemName]
      except KeyError:
        print(f"Error: Item {itemName} not found!")
        return

      template.add("name", item.get("name", ""))
      template.add("description", item.get("description", ""))
      template.add("flavorText", item.get("flavorText", ""))

      if "category" in item:
        template.add("category", item.get("category", ""))

      # Status
      template.add("weight", formatNumber(item.get("weight", "")))
      template.add("stackSize", formatNumber(item.get("stackSize", "")))
      # template.add("requirements", item.get("category", ""))

      # Durability
      template.add("durability", formatNumber(item.get("durability", "")))
      template.add("repairItem", item.get("repairItem", ""))
      template.add("repairAmount", formatNumber(item.get("repairAmount", "")))

      # Decay
      template.add("decayLimit", formatNumber(item.get("decayLimit", "")))
      template.add("decayToItem", item.get("decayLimit", ""))

      # Battery
      template.add("batteryCapacity", formatNumber(item.get("batteryCapacity", "")))

      # Liquids
      template.add("liquidCapacity", formatNumber(item.get("liquidCapacity", "")))
      template.add("allowedLiquids", item.get("allowedLiquids", ""))

      # Research Minigame
      template.add("researchMaterial", item.get("researchMaterial", ""))

      # Scrapping
      if "scrapResults" in item:
        for index, scrapResult in enumerate(item.get("scrapResults")):
          template.add(f"scrapResults{index + 1}Item", scrapResult.get("item", ""))
          template.add(f"scrapResults{index + 1}AmountMin", formatNumber(scrapResult.get("quantityMin", "")))
          template.add(f"scrapResults{index + 1}AmountMax", formatNumber(scrapResult.get("quantityMax", "")))

      # Gear
      template.add("gearSlot", item.get("gearSlot", ""))
      template.add("gearArmor", item.get("gearArmor", ""))
      template.add("gearCapacity", item.get("gearCapacity", ""))
      template.add("gearWeightReduction", formatNumber(item.get("gearWeightReduction", "")))

      # Weapon
      template.add("weaponType", item.get("weaponType", ""))
      template.add("weaponDamage", formatNumber(item.get("weaponDamage", "")))
      template.add("weaponAmmoItem", item.get("weaponAmmoItem", ""))
      template.add("weaponAmmoCount", formatNumber(item.get("weaponAmmoCount", "")))
      # template.add("weaponChoppingQuality", item.ge("t"))
      template.add("weaponSecondaryAction", item.get("weaponSecondaryAction", ""))

      # Consumable
      template.add("consumableHungerFill", formatNumber(item.get("consumableHungerFill", "")))
      template.add("consumableFatigueFill", formatNumber(item.get("consumableFatigueFill", "")))
      template.add("consumableThirstFill", formatNumber(item.get("consumableThirstFill", "")))
      template.add("consumableRadiation", item.get("consumableRadiation", ""))
      if "consumableAppliesStatus" in item:
        for index, status in enumerate(item.get("consumableAppliesStatus")):
          template.add(f"consumableAppliesStatus{index + 1}", status)
      if "consumableRemovesStatus" in item:
        for index, status in enumerate(item.get("consumableRemovesStatus")):
          template.add(f"consumableRemovesStatus{index + 1}", status)

      # Cooking
      template.add("cookingIsCookware", item.get("cookingIsCookware", ""))
      # template.add("cookingStage", item.ge("t"))
      template.add("cookingRawItem", item.get("cookingRawItem", ""))
      template.add("cookingCookedItem", item.get("cookingCookedItem", ""))
      template.add("cookingBurnedItem", item.get("cookingBurnedItem", ""))

      time.sleep(1)

  TemplateModifier(site, 'Item', summary=summary).run()
