const db = wx.cloud.database()
const _ = db.command
const booksCollection = db.collection('vote')
var newsList=[]
Page({

  data: {
    // newsList: [], //列表数据
    iszan: [], //点过赞的id集合
    like_people: [], //每个列表数据的点赞的用户集合
    openid: ''
  },

  //页面加载初始化列表数据
  onLoad: function () {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => { // 获取用户openid
        console.log('云函数获取到的openid: ', res.result.openid)
        that.setData({
          openid: res.result.openid
        })
        booksCollection.field({ //发送请求获取列表数据
          _id: true,
          like: true,
          like_num: true,
          like_people: true
        }).get({
          success: res => {
            that.setData({
              newsList: res.data
            })
            var iszan = that.data.iszan;
            for (var i = 0; i < res.data.length; i++) { //数据获取成功后，进行遍历，拿到所有已经点过赞的书籍id
              for (let j = 0; j < res.data[i].like_people.length; j++) {
                if (res.data[i].like_people[j] == that.data.openid) { 
                  iszan.push(res.data[i]._id) //根据改用户的数据找到已经点赞的，把书籍id放入新建数组中
                }
              }
            }
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].like = false
              for (let j = 0; j < iszan.length; j++) { //利用新建的iszan数组与list数组的id查找相同的书籍id
                if (res.data[i]._id == iszan[j]) { //双重循环遍历，有相同的id则点亮红心
                  res.data[i].like = true
                }
              }
            }
            console.log(res.data)
            that.setData({
              iszan: this.data.iszan,
              newsList: res.data
            })
            wx.setStorageSync('zan', iszan);
          }
        })
      }
    })
  },

  // 点赞函数  获取对应id
  thumbsup: function (e) {
    var shareid = e.currentTarget.dataset.id;
    console.log("id"+shareid)

    this.zan(shareid);
  },

  //点赞处理函数    
  zan: function (item_id) {
    var that = this;
    var cookie_id = wx.getStorageSync('zan') || []; //获取全部点赞的id
    var openid = that.data.openid
    console.log(openid)
    for (var i = 0; i < that.data.newsList.length; i++) {
      if (that.data.newsList[i]._id == item_id) { //数据列表中找到对应的id
        var num = that.data.newsList[i].like_num; //当前点赞数
        if (cookie_id.includes(item_id) ) { //已经点过赞了，取消点赞
          for (var j in cookie_id) {
            if (cookie_id[j] == item_id) {
              cookie_id.splice(j, 1); //删除取消点赞的id
            }
          }
      
          --num; //点赞数减1
          that.setData({
            [`newsList[${i}].like_num`]: num, //es6模板语法，常规写法报错
            [`newsList[${i}.].like`]: false //我的数据中like为'false'是未点赞
          })
          wx.setStorageSync('zan', cookie_id);
          wx.showToast({
            title: "取消点赞",
            icon: 'none'
          })
          // this.data.newsList[i].like_people.pop(openid)
          newsList[i].like_people.pop(openid)
        } else { //点赞操作
          ++num; //点赞数加1
         

          that.setData({
            [`newsList[${i}].like_num`]: num,

            [`newsList[${i}.].like`]: true
          })
          cookie_id.unshift(item_id); //新增赞的id
          wx.setStorageSync('zan', cookie_id);
          wx.showToast({
            title: "点赞成功",
            icon: 'none'
          })
          
          // this.data.newsList[i].like_people.push(openid)
          newsList[i].like_people.push(openid)
        }
        //和后台交互，后台数据要同步
        booksCollection.doc(item_id).update({
          data: {
            like: newsList[i].like,
            like_num: num,
            like_people: newsList[i].like_people
          },
          success: res => {
            console.log(res)
          }
        })
      }
    }
  }
})