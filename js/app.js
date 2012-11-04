/**
 * File built with Cakefile at 2012-11-06T01:30:05+09:00
 */

/**
# Backbone & Backbone LayoutManager を使用したサンプル Twitter アプリ
# @author Yu Inao <inao@sonicjam.co.jp>
*/


/**
# アプリの名前空間をグローバルオブジェクトへ追加
# @module TwitterApp
# @static
# @main TwitterApp
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.TwitterApp = {
    /**
    # @property app
    # @type {Object} Backbone.Events を内包させたアプリモジュール
    */

    app: _.extend({}, Backbone.Events),
    /**
    # モジュールのメモ化
    # @method module
    # @param {String} 呼び出すモジュール名
    # @return {Object} 呼び出されたモジュール
    # @url http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules/
    */

    module: _.memoize(function(name) {
      return window.TwitterApp.module[name] || {
        Views: {}
      };
    })
  };

  /**
  # Backbone LayoutManager の設定
  # @module Backbone
  # @class LayoutManager
  # @static
  # @extends Backbone.View
  # @method configure
  # @url http://tbranyen.github.com/backbone.layoutmanager/#configuration
  */


  Backbone.LayoutManager.configure({
    /**
    # @property manage
    # @type {Boolean} Backbone.View クラスに LayoutManager の機能を継承させる
    # @default false
    # @url http://tbranyen.github.com/backbone.layoutmanager/#usage/structuring-a-view
    */

    manage: true,
    /**
    # @property prefix
    # @type {String} テンプレートパスの接頭辞
    # @url https://github.com/tbranyen/backbone.layoutmanager/pull/184
    */

    prefix: './templates/',
    /**
    # template プロパティで指定した値からテンプレートデータをオブジェクト化して返す
    # @method fetch
    # @url http://tbranyen.github.com/backbone.layoutmanager/#configuration/asynchronous-synchronous-fetching
    */

    fetch: function(path) {
      var done;
      done = this.async();
      return $.ajax({
        dataType: 'text',
        success: function(data) {
          return done(_.template(data));
        },
        type: 'GET',
        url: "" + path + ".html"
      });
    }
    /**
    # @method render
    # @url http://tbranyen.github.com/backbone.layoutmanager/#configuration/global-level
    */

    /* underscore テンプレート以外を使用する場合などに上書きする
    render: (template, context) ->
      return template context
    */

  });

  jQuery(function($) {
    var Router, Tweet, app;
    app = TwitterApp.app;
    Tweet = TwitterApp.module('tweet');
    /**
    # URL 管理ルータークラス
    # @class Router
    # @constructor
    # @extends Backbone.Router
    # @url http://backbonejs.org/#Router
    */

    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      /**
      # URL と対応する処理メソッドの定義
      # @property routes
      # @type {Object} key=URL: value=メソッド名 で指定
      # @url http://backbonejs.org/#Router-routes
      */


      Router.prototype.routes = {
        '': 'home',
        'search/:query': 'search'
      };

      /**
      # トップページのルーティング
      # @method home
      # @async
      */


      Router.prototype.home = function() {
        var main, tweets;
        main = new Backbone.View({
          el: '#main',
          template: 'layout'
        });
        tweets = new Tweet.Collection();
        tweets.url({
          q: '#ajimibu',
          lang: 'ja'
        });
        return tweets.fetch().success(function() {
          var list;
          list = main.setView('.item', new Tweet.Views.List({
            collection: tweets
          }));
          return main.render();
        });
      };

      Router.prototype.search = function(query) {
        return alert(query);
      };

      return Router;

    })(Backbone.Router);
    app.router = new Router();
    return Backbone.history.start();
  });

}).call(this);
