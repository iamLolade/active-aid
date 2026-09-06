/**
 * Backward-compatibility re-exports.
 *
 * All cross-browser API logic now lives in ./browser-api.js.
 * This file re-exports everything so existing imports still work.
 */
export {
  storageSyncGet,
  storageSyncSet,
  storageSyncRemove,
  storageLocalGet,
  storageLocalSet,
  storageLocalRemove,
  notificationsCreate,
  openActionPopup,
  tabsCreate,
  alarmsCreate,
  alarmsGet,
  runtimeSendMessage,
  getURL,
} from "./browser-api.js"
