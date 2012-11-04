###*
# Backbone & Backbone LayoutManager を使用したサンプル Twitter アプリ
# @author Yu Inao <inao@sonicjam.co.jp>
###


###*
# Twitter 処理モジュール
# @module TwitterApp
# @submodule Tweet
###
((Tweet) ->

  ###*
  # Twitter Search API から取得する情報を格納するクラス
  # @class TweetCollection
  # @constructor
  # @namespace Tweet.Collection
  # @extends Backbone.Collection
  # @url http://backbonejs.org/#Collection
  ###
  class TweetCollection extends Backbone.Collection

    ###*
    # リクエスト先 URL の指定
    # @method url
    # @return {String} リクエスト URL
    # @url http://backbonejs.org/#Collection-url
    ###
    url: (queries) ->
      return 'http://search.twitter.com/search.json?q=%23ajimibu&lang=ja&callback=?'

    ###*
    # レスポンスデータから不要部分を除く
    # @method parse
    # @param {Object} data レスポンスデータ
    # @return {Object} 整形したレスポンスデータ
    # @url http://backbonejs.org/#Collection-parse
    ###
    parse: (data) ->
      return data.results


  ###*
  # Twitter Search API から取得した情報を表示するクラス
  # @class TweetCollection
  # @constructor
  # @namespace Tweet.Collection
  # @extends Backbone.LayoutManager
  # @url http://backbonejs.org/#View
  # @url https://github.com/tbranyen/backbone.layoutmanager/pull/184
  ###
  class TweetViewList extends Backbone.View

    ###*
    # @property template
    # @type {String} テンプレートファイル名
    # @url http://tbranyen.github.com/backbone.layoutmanager/#usage/structuring-a-view
    ###
    template: 'list'

    ###*
    # テンプレートに渡すデータのシリアライズ
    # @method data
    # @return {Object} シリアライズされたオブジェクト
    # @url https://github.com/tbranyen/backbone.layoutmanager/pull/184
    ###
    data: ->
      tweets = []
      console.debug @collection
      for model in @collection.models
        tweets.push
          user: model.attributes.from_user
          name: model.attributes.from_user_name
          image: model.attributes.profile_image_url
          text: model.attributes.text
      return { tweets: tweets }


  Tweet.Collection = TweetCollection
  Tweet.Views.List = TweetViewList

)(TwitterApp.module('tweet'))