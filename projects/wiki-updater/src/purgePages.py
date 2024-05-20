import json
import string
import time
import re

from urllib3.exceptions import HTTPError

from mwcleric import TemplateModifierBase
from mwparserfromhell.nodes import Template

def purgePages(site):
    pages = site.pages_using(template="Recipes")
    for page in pages:
        # TODO: extract this logic and use everywhere else
        # Retry loop
        while True:
            try:
                site.purge(page)
                print(f"Purged page {page.name}")
            except:
                # TODO: filter for HTTPError 429
                time.sleep(1)
                print(f"Too many requests, sleeping...")
                continue

            # We are done with retry loop
            break




