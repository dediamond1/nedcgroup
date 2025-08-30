import { Alert } from "react-native"

class AlertManager {
  constructor() {
    this.queue = []
    this.isShowing = false
  }

  show(title, message, buttons = [{ text: "OK" }]) {
    this.queue.push({ title, message, buttons })
    this.processQueue()
  }

  processQueue() {
    if (this.isShowing || this.queue.length === 0) return

    this.isShowing = true
    const { title, message, buttons } = this.queue.shift()

    Alert.alert(
      title,
      message,
      buttons.map((button) => ({
        ...button,
        onPress: () => {
          if (button.onPress) button.onPress()
          this.isShowing = false
          this.processQueue()
        },
      })),
    )
  }
}

export default new AlertManager()

