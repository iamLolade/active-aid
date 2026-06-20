/**
 * Cross-browser API adapter.
 *
 * Detects the runtime namespace and provides a unified Promise-based API
 * that works in Chrome, Firefox (MV3), and Edge.
 *
 * Usage:
 *   import { storageLocalGet, runtimeSendMessage } from "../shared/browser-api.js"
 *
 * Firefox: uses the native browser.* namespace (Promise-based).
 * Chrome/Edge: uses the chrome.* namespace (callback-based, wrapped in Promises).
 */

const isFirefox = typeof browser !== "undefined"

/**
 * Resolves the runtime namespace.
 * Returns `browser` for Firefox, `chrome` for Chrome/Edge.
 */
function resolveNamespace() {
  if (isFirefox) return browser
  return chrome
}

/**
 * Wraps a chrome.* callback-style API call in a Promise.
 * For Firefox (browser.*), calls return Promises natively, so we pass through.
 *
 * @param {Function} fn - A function that receives a callback and calls it with (result).
 * @returns {Promise<any>}
 */
function promisify(fn) {
  if (isFirefox) {
    // browser.* APIs already return Promises
    return fn()
  }
  return new Promise((resolve, reject) => {
    fn((result) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(result)
    })
  })
}

/**
 * Wraps a chrome.* callback-style API call that follows the
 * (items, callback) pattern for "set" operations (void return).
 */
function promisifySet(fn) {
  if (isFirefox) {
    return fn()
  }
  return new Promise((resolve, reject) => {
    fn(() => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve()
    })
  })
}

const ns = resolveNamespace()

// --- Storage (sync) ---

export function storageSyncGet(key) {
  return promisify((cb) => ns.storage.sync.get(key, cb))
}

export function storageSyncSet(items) {
  return promisifySet((cb) => ns.storage.sync.set(items, cb))
}

export function storageSyncRemove(keys) {
  return promisifySet((cb) => ns.storage.sync.remove(keys, cb))
}

// --- Storage (local) ---

export function storageLocalGet(key) {
  return promisify((cb) => ns.storage.local.get(key, cb))
}

export function storageLocalSet(items) {
  return promisifySet((cb) => ns.storage.local.set(items, cb))
}

export function storageLocalRemove(keys) {
  return promisifySet((cb) => ns.storage.local.remove(keys, cb))
}

// --- Notifications ---

export function notificationsCreate(notificationId, options) {
  if (isFirefox) {
    return ns.notifications.create(notificationId, options)
  }
  return new Promise((resolve, reject) => {
    ns.notifications.create(notificationId, options, (createdId) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(createdId)
    })
  })
}

// --- Alarms ---

export function alarmsCreate(name, alarmInfo) {
  if (isFirefox) {
    return ns.alarms.create(name, alarmInfo)
  }
  return new Promise((resolve, reject) => {
    ns.alarms.create(name, alarmInfo, () => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve()
    })
  })
}

export function alarmsGet(name) {
  if (isFirefox) {
    return ns.alarms.get(name)
  }
  return new Promise((resolve, reject) => {
    ns.alarms.get(name, (alarm) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(alarm ?? null)
    })
  })
}

// --- Runtime messaging ---

export function runtimeSendMessage(message) {
  if (isFirefox) {
    return ns.runtime.sendMessage(message)
  }
  return new Promise((resolve, reject) => {
    ns.runtime.sendMessage(message, (response) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(response)
    })
  })
}

// --- Runtime lifecycle ---

export function getURL(path) {
  return ns.runtime.getURL(path)
}

// --- Notifications listener (used by sw.js) ---

export function onNotificationButtonClicked(handler) {
  ns.notifications.onButtonClicked.addListener(handler)
}

// --- Alarms listener ---

export function onAlarm(handler) {
  ns.alarms.onAlarm.addListener(handler)
}

// --- Runtime listeners ---

export function onInstalled(handler) {
  ns.runtime.onInstalled.addListener(handler)
}

export function onStartup(handler) {
  if (ns.runtime.onStartup) {
    ns.runtime.onStartup.addListener(handler)
  }
}

export function onMessage(handler) {
  ns.runtime.onMessage.addListener(handler)
}

