import json
import string
import time
import re

from mwcleric import TemplateModifierBase
from mwparserfromhell.nodes import Template

summary = 'Automatically updating recipes data'

pageTextTemplate = '''
This page is generated using a script! DO NOT EDIT manually!

Please refer to [[Data:Recipes]] for additional information.

== Recipes ==

{recipes}
'''

def chunks(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def recipeToTemplateString(recipe):
    recipeTemplate = Template("itemRecipe")

    recipeTemplate.add("resultItem", recipe.get("resultItem"))
    recipeTemplate.add("resultAmount", recipe.get("resultAmount", 1))

    recipeTemplate.add("requiredStation", recipe.get("requiredStation", ""))
    recipeTemplate.add("craftDuration", str(recipe.get("craftDuration", 0)))

    for index, ingredient in enumerate(recipe.get("ingredients")):
        recipeTemplate.add("ingredient{}Item".format(index + 1), ingredient.get("ingredientItem"))
        recipeTemplate.add("ingredient{}Amount".format(index + 1), ingredient.get("resultAmount", 1))

    return str(recipeTemplate)

def recipesToChunkStrings(recipes, recipesPerPage):
    recipeChunks = chunks(recipes, recipesPerPage)
    return [
      "\n".join([recipeToTemplateString(r) for r in chunk])
      for chunk in recipeChunks
    ]

recipesPageNamePattern = r'Data:Recipes/([\d]+)'

def updateRecipes(site, data):
    pages = site.pages_using(template="ItemRecipe",namespace="Data")

    # Find data pages with ItemRecipe template
    recipesPages = {}
    for page in pages:
        match = re.search(recipesPageNamePattern, page.name)
        if not match:
            print(f"WARNING: Unexpected data page with ItemRecipe template: {page.name}")
            continue

        pageIndex = int(match.group(1))
        recipesPages[pageIndex] = page

    # Store recipes in page, in limite chunks (because of template-per-page limit)
    recipesChunks = recipesToChunkStrings(data, recipesPerPage = 50)
    for index, chunk in enumerate(recipesChunks):
        page = recipesPages.get(index, False)

        pageText = pageTextTemplate.format(recipes=chunk)

        if not page:
            pageName = f"Data:Recipes/{index}"
            page = site.client.pages[pageName]
            site.save(page, pageText, summary=summary)
            print(f"Created recipe page for chunk #{index}")
        else:
            site.save(page, pageText, summary=summary)
            del recipesPages[index]
            print(f"Updated recipe page for chunk #{index}")

    # Remove remaining pages
    for page in recipesPages:
        site.delete(page, reason=summary)
        print(f"Removed unused recipes page {page.name}")


