//index.js
const app = getApp()

// 数据库
const db = wx.cloud.database()
const _ = db.command
const userCollection = db.collection('user')
const booksCollection = db.collection('vote')


Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    u_openid:'',
    guet:0,
    gx:0,
    yk:0,
    gl:0,
    sf:0,
    num:'',
    userList:[],
    num1:'',
   is_zan:false
  },

  onLoad: function() {
    // let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => { // 获取用户openid
        console.log('云函数获取到的openid: ', res.result.openid)
        this.setData({
          u_openid: res.result.openid
        })
// 获取用户列表
        userCollection.get({
          success: res => {
            console.log(res.data)
            this.setData({
              userList:res.data,
              num1:res.data[0]._id 
            })
            var flag = false;//找到了没
         
            for(var i=0;i<res.data.length;i++){
              if(res.data[i]._openid==this.data.u_openid){
                console.log("equal")
                this.setData({
                  num1:res.data[i]._id
                })
                if(res.data[i].status==true){
                  this.setData({
                    is_zan:true
                  })
                  
                }
                flag = true
                break
              }
            }
            if(flag==false){
              var jj = this.data.u_openid
              userCollection.add({
                data:{
                  _openid:jj,
                  status:false
                }
              })
              this.setData({
                num1:res.data[i]._id
              })
            }
            console.log(this.data.userList)
          }
        })

        booksCollection.field({ //发送请求获取列表数据
          _id: true,
          like_guet: true,
          like_gx: true,
          like_yk: true,
          like_gl: true,
          like_sf: true
          
        }).get({
          success: res => {
            var that = this
            console.log(res.data)
            that.setData({
              guet: res.data[0].like_guet,
              gx: res.data[0].like_gx,
              yk:res.data[0].like_yk,
              sf:res.data[0].like_sf,
              gl:res.data[0].like_gl,
              num:res.data[0]._id              
            })
        }
        })
        
      }

})
  },
  update_status:function(){
    wx.showToast({
      title: "点赞成功",
      icon: 'none'
    })
    userCollection.doc(this.data.num1).update({
      data:{
        status:true
      }
    })
  },

  guet_m:function(){
    if(this.data.is_zan == false){
      var a = this.data.guet + 1
    this.setData({
      guet:a
    })
    // 更新
    booksCollection.doc(this.data.num).update({
      data:{
        like_guet:a
      }
    })
    this.data.is_zan=true
    this.update_status()
    
    }

  },
  
  
  gx_m:function(){
    if(this.data.is_zan == false){
      var a = this.data.gx + 1
    this.setData({
      gx:a
    })
    // 更新
    booksCollection.doc(this.data.num).update({
      data:{
        like_gx:a
      }
    })
    this.data.is_zan=true
    this.update_status()
    
    }
  },
  gl_m:function(){
    if(this.data.is_zan == false){
      var a = this.data.gl + 1
    this.setData({
      gl:a
    })
    // 更新
    booksCollection.doc(this.data.num).update({
      data:{
        like_gl:a
      }
    })
    this.data.is_zan=true
    this.update_status()
    
    }
  },
  yk_m:function(){
    if(this.data.is_zan == false){
      var a = this.data.yk + 1
    this.setData({
      yk:a
    })
    // 更新
    booksCollection.doc(this.data.num).update({
      data:{
        like_yk:a
      }
    })
    this.data.is_zan=true
    this.update_status()
    
    }
  },
  sf_m:function(){
    if(this.data.is_zan == false){
      var a = this.data.sf + 1
    this.setData({
      sf:a
    })
    // 更新
    booksCollection.doc(this.data.num).update({
      data:{
        like_sf:a
      }
    })
    this.data.is_zan=true
    this.update_status()
    
    }
  }
})
//   if (!wx.cloud) {
  //     wx.redirectTo({
  //       url: '../chooseLib/chooseLib',
  //     })
  //     return
  //   }
    

  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             this.setData({
  //               avatarUrl: res.userInfo.avatarUrl,
  //               userInfo: res.userInfo
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  

  // onGetUserInfo: function(e) {
  //   if (!this.data.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },

  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid

  //       // openid = res.result.openid
  //       // console.log(openid)
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },

  // // 上传图片
  // doUpload: function () {
  //   // 选择图片
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {

  //       wx.showLoading({
  //         title: '上传中',
  //       })

  //       const filePath = res.tempFilePaths[0]
        
  //       // 上传图片
  //       const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //       wx.cloud.uploadFile({
  //         cloudPath,
  //         filePath,
  //         success: res => {
  //           console.log('[上传文件] 成功：', res)

  //           app.globalData.fileID = res.fileID
  //           app.globalData.cloudPath = cloudPath
  //           app.globalData.imagePath = filePath
            
  //           wx.navigateTo({
  //             url: '../storageConsole/storageConsole'
  //           })
  //         },
  //         fail: e => {
  //           console.error('[上传文件] 失败：', e)
  //           wx.showToast({
  //             icon: 'none',
  //             title: '上传失败',
  //           })
  //         },
  //         complete: () => {
  //           wx.hideLoading()
  //         }
  //       })

  //     },
  //     fail: e => {
  //       console.error(e)
  //     }
  //   })
  // },
