//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      fail:res => {
        console.log(res)
      },
      success:res => {
        console.log(res)
        if (res.code) {
          wx.request({
            url: this.globalData.baseUrl + '/wx/auth',
            data: {
              code: res.code
            },
            success: res1 => {
              if(res1.data.success){
                wx.request({
                  url: 'https://api.weixin.qq.com/sns/jscode2session',
                  data: res1.data.data,
                  success: res2 =>{
                    console.log(res2)
                    if(res2.data.openid){
                      wx.request({
                        url: this.globalData.baseUrl + `/user/${res2.data.openid}`,
                        success: res3 => {
                          if(res3.data.success&&res3.data.data){
                            this.globalData.userId = res3.data.data.id
                            this.globalData.userName = res3.data.data.name
                          }else{
                            wx.showToast({
                              title: '该微信号暂未绑定',
                              icon: 'none',
                              duration: 2000
                            })
                          }
                        }
                      })
                      this.globalData.openid = res2.data.openid
                    }else{
                      wx.showToast({
                        title: '获取openid失败',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }else{
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userId: "",
    userName: "",
    baseUrl : "http://127.0.0.1:8085"
  }
})