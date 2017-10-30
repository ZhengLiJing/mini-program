
var postsData = require("../../../data/posts-data.js")
var app = getApp();
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var postId = options.id;
    console.log(options.query);
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postDatas: postData
    });

    var arraysCollected = wx.getStorageSync('arraysCollected');
    if (arraysCollected) {
      var currentCollected = arraysCollected[postId];
      this.setData({
        collected: currentCollected
      })
    }
    else {
      //若缓存里没有收藏的信息，则创建收藏缓存对象
      arraysCollected = {};
      arraysCollected[postId] = false;
      wx.setStorageSync('arraysCollected', arraysCollected);
    }
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic:true
      })
    }
    this.setMusicPlay();
  },
  setMusicPlay: function() {
      //同步全部播放
      var that = this;
      wx.onBackgroundAudioPlay(function () {
        that.setData({
          isPlayingMusic: true
        })
        app.globalData.g_isPlayingMusic = true;
        app.globalData.g_currentMusicPostId = that.data.currentPostId;
      });
      wx.onBackgroundAudioPause(function () {
        that.setData({
          isPlayingMusic: false
        })
        app.globalData.g_isPlayingMusic = true;
        app.globalData.g_currentMusicPostId = null;
      });
    },
  onCollectionTap: function (event) {
    this.getPostsCollectedSyc()
    // this.getPostsCollectedAsy();
  },

  getPostsCollectedSyc: function () {
    var arraysCollected = wx.getStorageSync('arraysCollected');
    var currentCollected = arraysCollected[this.data.currentPostId];
    currentCollected = !currentCollected;
    //更新当前postid下的的收藏状态
    arraysCollected[this.data.currentPostId] = currentCollected;
    //更新了文章是否收藏的缓存值，也就是若是已经收藏了，则更新为不收藏状态，这里只是在缓冲中作了更新，实际开发中应该是在数据库中
    //做了更新。
    // this.showToast(arraysCollected, currentCollected);
    this.showModal(arraysCollected, currentCollected)
  },

  getPostsCollectedAsy: function () {
    var arraysCollected = wx.getStorageSync('arraysCollected');
    var currentCollected = arraysCollected[this.data.currentPostId];
    currentCollected = !currentCollected;
    //更新当前postid下的的收藏状态
    arraysCollected[this.data.currentPostId] = currentCollected;
    //更新了文章是否收藏的缓存值，也就是若是已经收藏了，则更新为不收藏状态，这里只是在缓冲中作了更新，实际开发中//应该是在数据库中
    //做了更新。
    this.showToast(arraysCollected, currentCollected);
    that.showToast(arraysCollected, currentCollected);
  },

  showModal: function (arraysCollected, currentCollected) {
    var that = this;
    wx.showModal({
      title: "收藏提示",
      content: currentCollected ? "是否确定收藏该文章?" : "是否取消收藏该文章?",
      showCancel: true,
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('arraysCollected', arraysCollected);
          //更新数据绑定变量，从而实现图片切换
          that.setData({
            collected: currentCollected
          })
        }
      }
    })
  },

  showToast: function (arraysCollected, currentCollected) {
    wx.setStorageSync('arraysCollected', arraysCollected);
    //更新数据绑定变量，从而实现图片切换
    this.setData({
      collected: currentCollected
    }),
      wx.showToast({
        title: currentCollected ? "收藏成功" : "取消收藏",
        duration: 1000
      })
  },

  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到微博",
      "分享给QQ好友"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: "用户" + itemList,
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能。"
        })
      }
    })
  },

  onMusicTap: function (event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId].music;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: postData.url,
        title: postData.title,
        coverImgUrl: postData.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})