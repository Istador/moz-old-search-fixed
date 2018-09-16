"use strict"

const { Cc, Ci, document } = require('chrome')
const pref = require('./prefs')('extensions.blackpinguin.oldsearchfixed')

const windows   = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator)
const search    = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService)
const observers = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService)


// replaces default browser functions with custom ones, and undoes this when the extenstion unloads
const [ inject, uninject ] = (() => {
  var injected = []
  let inject = (e, k, f) => {
    let old = e[k]
    e[k] = function () {
      var r = f.apply(e, arguments)
      if (r !== undefined) return r
      return old.apply(e, arguments)
    }
    injected.push([e, k, old])
  }
  let uninject = () => {
    for (var i in injected) {
      let [e, k, old] = injected[i]
      e[k] = old
      delete injected[i]
    }
  }
  return [ inject, uninject ]
})()

// calls the callback for each browser window
const forEachWindow = (callback) => {
  var ws = windows.getEnumerator('navigator:browser')
  var w
  while (w = ws.getNext()) callback(w)
}


// sets the icon or resets it back to the default for search bars in all windows
const setIcon = (val = true) => {
  if (val && pref('searchbar.icon', true)) { 
    forEachWindow((w) => {
      let icon = w.BrowserSearch.searchBar.boxObject.lastChild.children[0].children[0].children[0]
      icon.style.cssText = 'list-style: none; background-image: url(' + w.BrowserSearch.searchBar.getAttribute('src') + '); background-size: 16px; background-position: center center; background-repeat: no-repeat;'
    })
  }
  else {
    forEachWindow((w) => {
      let icon = w.BrowserSearch.searchBar.boxObject.lastChild.children[0].children[0].children[0]
      icon.style.cssText = ''
    })
  }
}


// change the engine and icon if it differst from the default
const changeEngine = (type, engine) => {
  engine = typeof(engine) == "string" ? search.getEngineByName(engine) : engine
  if (search.defaultEngine !== engine) {
    if (engine && pref(type, true)) {
      search.defaultEngine = engine
      setIcon()
    }
    return pref(type + '.donotsearch', true)
  }
  return undefined
}


// initializes one window
const init = (() => {
  var initialized = []
  return (w) => {
    if (initialized.indexOf(w) !== -1) return

    if (w.BrowserSearch) {
      inject(w.BrowserSearch.searchBar, 'doSearch', (aData, aWhere, engine) => {
        if (changeEngine('searchbar', engine)) {
          w.BrowserSearch.searchBar._textbox.popup.closePopup()
          //w.BrowserSearch.searchBar._textbox.openPopup()
          return false
        }
      })
      setIcon()
    }

    if (w.gURLBar) {
      inject(w.gURLBar, '_parseAndRecordSearchEngineLoad', (engine) => {
        if (changeEngine('urlbar', engine)) {
          return [ undefined, undefined ]
        }
      })
      inject(w.gURLBar, '_loadURL', (url, browser, postData) => {
        return url === undefined && postData === undefined && pref('urlbar.donotsearch', false) ? false : undefined
      })
    }

    initialized.push(w)
  }
})()


// observer for new windows
const newWindow = {
  register:   () => observers.addObserver(newWindow,    'browser-delayed-startup-finished', false),
  unregister: () => observers.removeObserver(newWindow, 'browser-delayed-startup-finished'),
  observe:    init,
}


// extension gets unloaded (clean up everything changed by this extension)
module.exports.onUnload = (reason) => {
  newWindow.unregister()
  pref.unfollow()
  uninject()
  setIcon(false)
}


// initialize extension
module.exports.main = (options, callback) => {
  if (options.loadReason == "install" || options.loadReason == "startup") {
    pref.follow()
    pref.onchange('searchbar.icon', setIcon)
    newWindow.register()
    forEachWindow(init)
  }
}
