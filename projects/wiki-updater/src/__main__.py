import os
import json
from updateItems import updateItems
from createItems import createItems
from mwcleric import AuthCredentials
from mwcleric import WikiggClient

credentials = AuthCredentials(user_file="me")
site = WikiggClient('abioticfactor', credentials=credentials)

exportedFilesBasePath = os.environ.get('ABF_EXPORTED_PATH')

itemsJsonFilename = os.path.join(exportedFilesBasePath, "Items.json")
with open(itemsJsonFilename, 'r', encoding='utf-8') as f:
    data = json.load(f)

# createItems(site, data)
updateItems(site, data)
