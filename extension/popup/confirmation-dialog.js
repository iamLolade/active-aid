export function createConfirmationDialog(dialog) {
  const title = dialog.querySelector("#confirmDialogTitle")
  const description = dialog.querySelector("#confirmDialogDescription")
  const cancel = dialog.querySelector("#confirmDialogCancel")
  const submit = dialog.querySelector("#confirmDialogSubmit")

  return function confirm(options) {
    if (dialog.open) return Promise.resolve(false)

    title.textContent = options.title
    description.textContent = options.description
    submit.textContent = options.confirmLabel
    dialog.returnValue = ""

    return new Promise((resolve) => {
      dialog.addEventListener(
        "close",
        () => {
          resolve(dialog.returnValue === "confirm")
        },
        { once: true }
      )
      dialog.showModal()
      cancel.focus()
    })
  }
}
