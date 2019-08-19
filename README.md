# Old Search Fixed 3

This Firefox add-on remembers the selected search engine by setting it as the default engine, like it was before Firefox 43.

Inspired by the Firefox add-ons [Old Search](https://addons.mozilla.org/en-US/firefox/addon/old-search1/) and [Old Search Fixed 2](https://addons.mozilla.org/en-US/firefox/addon/old-search-fixed2/) that aren't working anymore.


## Installation

The newest version of this add-on can be downloaded on the [releases page](https://github.com/Istador/old-search-fixed/releases/).

Just click in your browser, for the newest release at the top, on the asset with the `xpi` file extension.

Your browser should ask you if you want to allow `Github.com` to install software.
`Allow` it.

Next your browser should complain about the add-on being unverified. This is happening because this add-on isn't digitally signed by Mozilla (they don't do this for legacy add-ons anymore).
`Add` it anyway.

The add-on should now be installed and already working.
(You can verify this by looking at the Search Bar. It should show the icon of your default search provider instead of the magnifier icon.)
Once installed, the add-on should auto-update itself when new releases are published.


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

When you wan't to build this add-on from the source code yourself, just run `make` to build the `xpi` file that can be installed in the browser:

```bash
make
```

Building this add-on requires `nodejs` being installed on your computer.

### Build without `make`

If you don't know how to or don't want to install `make` on your computer (e.g. on Windows), then you can also build it manually:

```bash
npm install
npx jpm xpi
```
