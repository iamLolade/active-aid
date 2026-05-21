export function storageSyncGet(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(result)
    })
  })
}

export function storageSyncSet(items) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(items, () => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve()
    })
  })
}

export function storageLocalGet(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(result)
    })
  })
}

export function storageLocalSet(items) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve()
    })
  })
}

export function notificationsCreate(notificationId, options) {
  return new Promise((resolve, reject) => {
    chrome.notifications.create(notificationId, options, (createdId) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(createdId)
    })
  })
}

export function runtimeSendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const err = chrome.runtime.lastError
      if (err) return reject(err)
      resolve(response)
    })
  })
}

