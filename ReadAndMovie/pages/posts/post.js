var postsData = require("../../data/posts-data.js")
Page({
  data: {
  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    this.setData({
      posts_key: postsData.postList,
    });
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
    // console.log("post id is"+postId);
  },
  onSwiperTap:function(event) {
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})