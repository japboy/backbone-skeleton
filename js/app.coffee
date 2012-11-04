###*
# Backbone & Backbone LayoutManager を使用したサンプル Twitter アプリ
# @author Yu Inao <inao@sonicjam.co.jp>
###


###*
# アプリの名前空間をグローバルオブジェクトへ追加
# @module TwitterApp
# @static
# @main TwitterApp
###
@TwitterApp =

  ###*
  # @property app
  # @type {Object} Backbone.Events を内包させたアプリモジュール
  ###
  app: _.extend {}, Backbone.Events

  ###*
  # モジュールのメモ化
  # @method module
  # @param {String} 呼び出すモジュール名
  # @return {Object} 呼び出されたモジュール
  # @url http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules/
  ###
  module: _.memoize (name) ->
    return window.TwitterApp.module[name] or { Views: {} }


###*
# Backbone LayoutManager の設定
# @module Backbone
# @class LayoutManager
# @static
# @extends Backbone.View
# @method configure
# @url http://tbranyen.github.com/backbone.layoutmanager/#configuration
###
Backbone.LayoutManager.configure

  ###*
  # @property manage
  # @type {Boolean} Backbone.View クラスに LayoutManager の機能を継承させる
  # @default false
  # @url http://tbranyen.github.com/backbone.layoutmanager/#usage/structuring-a-view
  ###
  manage: true

  ###*
  # @property prefix
  # @type {String} テンプレートパスの接頭辞
  # @url https://github.com/tbranyen/backbone.layoutmanager/pull/184
  ###
  prefix: './templates/'

  ###*
  # template プロパティで指定した値からテンプレートデータをオブジェクト化して返す
  # @method fetch
  # @url http://tbranyen.github.com/backbone.layoutmanager/#configuration/asynchronous-synchronous-fetching
  ###
  fetch: (path) ->
    done = @async()
    $.ajax
      dataType: 'text'  # 文字列として取得 (重要!)
      success: (data) ->
        done _.template(data)
      type: 'GET'
      url: "#{path}.html"

  ###*
  # @method render
  # @url http://tbranyen.github.com/backbone.layoutmanager/#configuration/global-level
  ###
  ### underscore テンプレート以外を使用する場合などに上書きする
  render: (template, context) ->
    return template context
  ###


# DOM が全て読み込まれたら本処理を開始
jQuery ($) ->

  app = TwitterApp.app

  Tweet = TwitterApp.module 'tweet'

  ###*
  # URL 管理ルータークラス
  # @class Router
  # @constructor
  # @extends Backbone.Router
  # @url http://backbonejs.org/#Router
  ###
  class Router extends Backbone.Router

    ###*
    # URL と対応する処理メソッドの定義
    # @property routes
    # @type {Object} key=URL: value=メソッド名 で指定
    # @url http://backbonejs.org/#Router-routes
    ###
    routes:
      '': 'home'
      'search/:query': 'search'

    ###*
    # トップページのルーティング
    # @method home
    # @async
    ###
    home: ->
      main = new Backbone.View
        el: '#main'
        template: 'layout'

      tweets = new Tweet.Collection()

      tweets
      .url
        q: '#ajimibu'
        lang: 'ja'

      tweets
      .fetch()
      .success ->

        list = main.setView '.item', new Tweet.Views.List { collection: tweets }

        main.render()


    search: (query) ->
      alert query


  app.router = new Router()

  Backbone.history.start()