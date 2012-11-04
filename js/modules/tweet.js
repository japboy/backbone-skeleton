/**
 * File built with Cakefile at 2012-11-06T01:30:05+09:00
 */

/**
# Backbone & Backbone LayoutManager を使用したサンプル Twitter アプリ
# @author Yu Inao <inao@sonicjam.co.jp>
*/


/**
# Twitter 処理モジュール
# @module TwitterApp
# @submodule Tweet
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(Tweet) {
    /**
    # Twitter Search API から取得する情報を格納するクラス
    # @class TweetCollection
    # @constructor
    # @namespace Tweet.Collection
    # @extends Backbone.Collection
    # @url http://backbonejs.org/#Collection
    */

    var TweetCollection, TweetViewList;
    TweetCollection = (function(_super) {

      __extends(TweetCollection, _super);

      function TweetCollection() {
        return TweetCollection.__super__.constructor.apply(this, arguments);
      }

      /**
      # リクエスト先 URL の指定
      # @method url
      # @return {String} リクエスト URL
      # @url http://backbonejs.org/#Collection-url
      */


      TweetCollection.prototype.url = function(queries) {
        return 'http://search.twitter.com/search.json?q=%23ajimibu&lang=ja&callback=?';
      };

      /**
      # レスポンスデータから不要部分を除く
      # @method parse
      # @param {Object} data レスポンスデータ
      # @return {Object} 整形したレスポンスデータ
      # @url http://backbonejs.org/#Collection-parse
      */


      TweetCollection.prototype.parse = function(data) {
        return data.results;
      };

      return TweetCollection;

    })(Backbone.Collection);
    /**
    # Twitter Search API から取得した情報を表示するクラス
    # @class TweetCollection
    # @constructor
    # @namespace Tweet.Collection
    # @extends Backbone.LayoutManager
    # @url http://backbonejs.org/#View
    # @url https://github.com/tbranyen/backbone.layoutmanager/pull/184
    */

    TweetViewList = (function(_super) {

      __extends(TweetViewList, _super);

      function TweetViewList() {
        return TweetViewList.__super__.constructor.apply(this, arguments);
      }

      /**
      # @property template
      # @type {String} テンプレートファイル名
      # @url http://tbranyen.github.com/backbone.layoutmanager/#usage/structuring-a-view
      */


      TweetViewList.prototype.template = 'list';

      /**
      # テンプレートに渡すデータのシリアライズ
      # @method data
      # @return {Object} シリアライズされたオブジェクト
      # @url https://github.com/tbranyen/backbone.layoutmanager/pull/184
      */


      TweetViewList.prototype.data = function() {
        var model, tweets, _i, _len, _ref;
        tweets = [];
        console.debug(this.collection);
        _ref = this.collection.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          tweets.push({
            user: model.attributes.from_user,
            name: model.attributes.from_user_name,
            image: model.attributes.profile_image_url,
            text: model.attributes.text
          });
        }
        return {
          tweets: tweets
        };
      };

      return TweetViewList;

    })(Backbone.View);
    Tweet.Collection = TweetCollection;
    return Tweet.Views.List = TweetViewList;
  })(TwitterApp.module('tweet'));

}).call(this);
