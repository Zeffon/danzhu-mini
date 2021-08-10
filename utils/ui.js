/**
 * Create by Zeffon on 2020/10/3
 */

const showToast = function (icon = 'none', title, duration = 2000) {
  wx.showToast({
    icon,
    duration,
    title
  })
}

const linShowToast = function (icon = 'none', title, duration = 2000) {
  wx.lin.showToast({
    icon,
    title,
    duration
  })
}

export {
  showToast,
  linShowToast
}