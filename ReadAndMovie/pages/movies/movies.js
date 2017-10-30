// pages/movies/movies.js
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3",
      comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3",
      top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieList(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieList(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieList(top250Url,"top250","豆瓣Top250");
  },
  getMovieList: function (url,settedKey,categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      }, // 设置请求的 header
      success: function (res) {
      that.processDoubanData(res.data,settedKey,categoryTitle);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processDoubanData(movieDouban,settedKey,categoryTitle){
    var movies = [];
    for(var idx in movieDouban.subjects){
     var subject = movieDouban.subjects[idx];
     var title = subject.title;
     if(title.length >= 6){
       title = title.substring(0,6) + "...";
     }
     var temp = {
       stars:util.convertToStarsArray(subject.rating.stars),
       title:title,
       average:subject.rating.average,
       coverageUrl:subject.images.large,
       movieId:subject.id
     };
     movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle:categoryTitle,
      movies:movies
    };
    this.setData(readyData);
  }
})