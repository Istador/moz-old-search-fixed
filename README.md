# Old Search Fixed 3

This Firefox add-on remembers the selected search engine by setting it as the default engine, like it was before Firefox 43.

Inspired by the Firefox add-ons [Old Search](https://addons.mozilla.org/en-US/firefox/addon/old-search1/) and [Old Search Fixed 2](https://addons.mozilla.org/en-US/firefox/addon/old-search-fixed2/) that aren't working anymore.


## Options

The following options can be setted in the Add-on's option page or via about:config under the `extensions.blackpinguin.oldsearchfixed` namespace.

- Search Bar [Bool]
   - Searching via the Search Bar saves the selected engine as the default.
- Don't search with the Search Bar engines [Bool]
   - Selecting an engine in the Search Bar only sets the default search engine and doesn't perform a search. A search can only be performed with the default engine then.
- Icon [Bool]
   - Show the icon of the default search engine in the Search Bar (instead of the magnifier icon).
- URL Bar [Bool]
   - Searching via the URL Bar saves the selected engine as the default.
- Don't search with the URL Bar engines [Bool]
   - Selecting an engine in the URL Bar only sets the default search engine and doesn't perform a search. A search can only be performed with the default engine then.


## Compability

Because it's an XUL extension and not a WebExtension, this add-on is incompatible with Firefox 57 ("Quantum") or higher.

But forks of Firefox that still support legacy add-ons should be compatible:

- [Waterfox](https://www.waterfoxproject.org/)

### Used Services

- nsIBrowserSearchService
- nsIPrefService
- nsIWindowMediator
- nsIObserverService


## Build

```bash
make
```
