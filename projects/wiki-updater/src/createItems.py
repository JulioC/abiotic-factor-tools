import json
import string
import time

from mwcleric import AuthCredentials
from mwcleric import WikiggClient

WIKITEXT = """{{{{Item
|name={name}}}}}

'''{name}''' is an [[item]] in ''[[Abiotic Factor]]''.

{{{{craftingSection|{name}}}}}
"""

summary = 'Automatically creating item page from game data'

def createItems(site, data):
    for key, item in data.items():
        page_name = item.get("name")
        page = site.client.pages[page_name]
        if page.exists:
            print(f"skip existing page {page_name}")
            continue

        pageText = WIKITEXT.format(
            name=item.get("name"),
        )

        print(f"save page {page_name}")
        page.save(pageText, summary=summary)
        time.sleep(1)
