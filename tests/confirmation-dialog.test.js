import test from "node:test"
import assert from "node:assert/strict"

import { createConfirmationDialog } from "../extension/popup/confirmation-dialog.js"

function createFakeDialog() {
  const nodes = {
    "#confirmDialogTitle": { textContent: "" },
    "#confirmDialogDescription": { textContent: "" },
    "#confirmDialogCancel": { focused: false, focus() { this.focused = true } },
    "#confirmDialogSubmit": { textContent: "" },
  }
  let closeHandler = null

  return {
    nodes,
    dialog: {
      open: false,
      returnValue: "",
      querySelector(selector) {
        return nodes[selector]
      },
      addEventListener(type, handler) {
        if (type === "close") closeHandler = handler
      },
      showModal() {
        this.open = true
      },
      closeWith(returnValue) {
        this.returnValue = returnValue
        this.open = false
        closeHandler()
      },
    },
  }
}

test("confirmation dialog resolves the selected action", async () => {
  const { dialog, nodes } = createFakeDialog()
  const confirm = createConfirmationDialog(dialog)
  const result = confirm({
    title: "Clear local data?",
    description: "This cannot be undone.",
    confirmLabel: "Clear local data",
  })

  assert.equal(nodes["#confirmDialogTitle"].textContent, "Clear local data?")
  assert.equal(nodes["#confirmDialogDescription"].textContent, "This cannot be undone.")
  assert.equal(nodes["#confirmDialogSubmit"].textContent, "Clear local data")
  assert.equal(nodes["#confirmDialogCancel"].focused, true)

  dialog.closeWith("confirm")
  assert.equal(await result, true)
})

test("confirmation dialog treats cancellation as false", async () => {
  const { dialog } = createFakeDialog()
  const confirm = createConfirmationDialog(dialog)
  const result = confirm({ title: "Delete?", description: "Confirm.", confirmLabel: "Delete" })

  dialog.closeWith("cancel")
  assert.equal(await result, false)
})
