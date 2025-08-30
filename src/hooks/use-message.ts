interface MessageImplements {
  info(title: string): void

  warning(title: string): void

  success(title: string): void

  error(title: string): void
}

export function useMessage() {
  class MessageClass implements MessageImplements {
    // 普通提示
    info(title: string): void {
      ElMessage.info(title)
    }

    // 警告提示
    warning(title: string): void {
      ElMessage.warning(title)
    }

    // 成功提示
    success(title: string): void {
      ElMessage({
        message: title,
        showClose: true,
        type: 'success',
      })
    }

    // 错误提示
    error(title: string): void {
      ElMessage({
        message: title,
        showClose: true,
        type: 'error',
      })
    }

    // 通知提示
    notify(content: string) {
      ElNotification.info(content)
    }

    // 错误通知
    notifyError(content: string) {
      ElNotification.error(content)
    }

    // 成功通知
    notifySuccess(content: string) {
      ElNotification.success(content)
    }

    // 警告通知
    notifyWarning(content: string) {
      ElNotification.warning(content)
    }
  }

  return new MessageClass()
}

export function useMessageBox() {
  class MessageBoxClass implements MessageImplements {
    // 普通提示
    info(msg: string): void {
      ElMessageBox.alert(msg, 'common.message.box.title', { type: 'info' }).then()
    }

    // 警告提示
    warning(msg: string): void {
      ElMessageBox.alert(msg, 'common.message.box.title', { type: 'warning' }).then()
    }

    // 成功提示
    success(msg: string): void {
      ElMessageBox.alert(msg, 'common.message.box.title', { type: 'success' }).then()
    }

    // 错误提示
    error(msg: string): void {
      ElMessageBox.alert(msg, 'common.message.box.title', { type: 'error' }).then()
    }

    // 确认窗体
    confirm(msg: string) {
      return ElMessageBox.confirm(msg, 'common.message.box.title', {
        confirmButtonText: 'common.button.confirmSuccess',
        cancelButtonText: 'common.button.confirmError',
        type: 'warning',
      })
    }

    // 提交内容
    prompt(msg: string) {
      return ElMessageBox.prompt(msg, 'common.message.box.title', {
        confirmButtonText: 'common.button.confirmSuccess',
        cancelButtonText: 'common.button.confirmError',
        type: 'warning',
      })
    }
  }

  return new MessageBoxClass()
}
