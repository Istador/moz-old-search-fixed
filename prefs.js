"use strict"

const { Cc, Ci, document } = require('chrome')

const prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).QueryInterface(Ci.nsIPrefBranchInternal)

// caches
var branches  = {}
var cache     = {}
var following = {}


// full preference path
const path = (ns, name) => (ns ? ns + '.' : '') + name


// gets a branch object based on the namespace
const branch = (ns) => {
  if (typeof branches[ns] === 'undefined') branches[ns] = prefs.getBranch(ns + '.')
  return branches[ns]
}


// updates the value in the cache
const retrieve = (id, def = null) => {
  // get type of preference
  let t = prefs.getPrefType(id)

  // determine which getter to use for the type
  let f = null
  if      (t === prefs.PREF_STRING) f = 'getStringPref'
  else if (t === prefs.PREF_BOOL)   f = 'getBoolPref'
  else if (t === prefs.PREF_INT)    f = 'getIntPref'

  // default value
  let v = def

  // retrieve preference
  if (f) { v = prefs[f](id) }

  // update cache
  cache[id] = v

  return v
}


// gets the value from the cache or retrieves it
const get = (ns, name, def = null) => {
  let id = path(ns, name)

  // update cache
  if (typeof cache[id] === 'undefined') {
    return retrieve(id, def)
  }

  return cache[id]
}


// register a callback for specific preferences
const onchange = (ns, name, f) => {
  // save callback
  following[path(ns, name)] = f

  // we have to follow the namespace to get informed about changes
  follow(ns)
}


// observer to get notified about preference changes to update the cache
const observer = {
  observe: (b, t, name) => {
    if (t !== 'nsPref:changed') return

    // update cache
    retrieve(name)

    // onchange callback
    if (typeof following[name] === 'function') {
      following[name](cache[name], name)
    }
  }
}


// follow all preference changes in the namespace
const follow = (ns) => {
  if (typeof following[ns] !== 'undefined') return
  prefs.addObserver(ns + '.', observer, false)
  following[ns] = true
}


// unfollow all preference changes in the namespace
const unfollow = (ns) => {
  if (typeof following[ns] === 'undefined') return
  prefs.removeObserver(ns + '.', observer)
  delete following[ns]
}


// export
module.exports = (ns) => {
  let f = (name, def = null) => get(ns, name, def)
  f.get      = f
  f.follow   = () => follow(ns)
  f.unfollow = () => unfollow(ns)
  f.onchange = (name, f) => onchange(ns, name, f)
  return f
}
