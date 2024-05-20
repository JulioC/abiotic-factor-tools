import os
import json
from updateItems import updateItems
from createItems import createItems
from updateRecipes import updateRecipes
from removeRecipes import removeRecipes
from purgePages import purgePages
from mwcleric import AuthCredentials
from mwcleric import WikiggClient

credentials = AuthCredentials(user_file="me")
site = WikiggClient('abioticfactor', credentials=credentials)

exportedFilesBasePath = os.environ.get('ABF_EXPORTED_PATH')

itemsJsonFilename = os.path.join(exportedFilesBasePath, "Items.json")
with open(itemsJsonFilename, 'r', encoding='utf-8') as f:
    items = json.load(f)

recipesJsonFilename = os.path.join(exportedFilesBasePath, "Recipes.json")
with open(recipesJsonFilename, 'r', encoding='utf-8') as f:
    recipes = json.load(f)

# TODO: make a proper CLI for running tasks
# createItems(site, items)
# updateItems(site, items)
# updateRecipes(site, recipes)
# purgePages(site)
