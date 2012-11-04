#
# My Cakefile  
# written by [Yu Inao](http://twitter.com/japboy)  
# updated on 2012-09-14

# TODO: Add YUIDoc for documentation

http = require 'http'
fs = require 'fs'
path = require 'path'
url = require 'url'
util = require 'util'
{spawn} = require 'child_process'

cleancss = require 'clean-css'
coffee = require 'coffee-script'
growl = require 'growl'
jade = require 'jade'
moment = require 'moment'
nib = require 'nib'
stylus = require 'stylus'
uglifyjs = require 'uglify-js'

# Specify target directories
targets = [
  './'
  './css'
  './js'
  './js/modules'
]

# Specify header for converted JavaScript/CSS files
header =
  msg: """
    /**
     * File built with Cakefile at #{moment().format()}
     */
    """ + '\n'
  token: /^.*\n.*\n.*\n(.*)/

# Get a list of specified files
getFiles = (dirpath, token) ->
  contents = fs.readdirSync dirpath
  files = []
  for content in contents when content.match(token)
    cpath = "#{dirpath}/#{content}"
    files.push cpath if fs.statSync(cpath).isFile()
  files

# Convert from CoffeeScript to JavaScript
convertCoffee = (fpath) ->
  conv_fpath = fpath.replace /\.coffee$/, '.js'
  _str = fs.readFileSync fpath, 'utf8'
  conv_str = coffee.compile _str

  if not fs.existsSync conv_fpath
    fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
    util.log "File built: #{conv_fpath}"
    growl "File built: #{conv_fpath}"
  else
    _str = fs.readFileSync conv_fpath, 'utf8'
    orig_str = _str.replace header.token, '$1'

    if conv_str != orig_str
      fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
      util.log "File built: #{conv_fpath}"
      growl "File built: #{conv_fpath}"

  true

# Convert from Jade to HTML
# https://github.com/visionmedia/jade#a5
convertJade = (fpath) ->
  conv_fpath = fpath.replace /\.jade$/, '.html'
  _str = fs.readFileSync fpath, 'utf8'
  html = jade.compile _str, { filename: fpath, pretty: true }
  conv_str = html()

  if not fs.existsSync conv_fpath
    fs.writeFileSync conv_fpath, conv_str, 'utf8'
    util.log "File built: #{conv_fpath}"
    growl "File built: #{conv_fpath}"
  else
    _str = fs.readFileSync conv_fpath, 'utf8'
    orig_str = _str
  
    if conv_str != orig_str
      fs.writeFileSync conv_fpath, conv_str, 'utf8'
      util.log "File built: #{conv_fpath}"
      growl "File built: #{conv_fpath}"

  true

# Convert from Stylus to CSS
# http://learnboost.github.com/stylus/docs/js.html
# FIXME: This must be SYNC
convertStyl = (fpath) ->
  conv_fpath = fpath.replace /\.styl$/, '.css'
  _str = fs.readFileSync fpath, 'utf8'

  stylus(_str)
  .set('filename', fpath)
  .set('compress', false)
  .use(nib())
  .render (err, str) ->
    util.error(err) if err

    conv_str = str

    if not fs.existsSync conv_fpath
      fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
      util.log "File built: #{conv_fpath}"
      growl "File built: #{conv_fpath}"
    else
      _str = fs.readFileSync conv_fpath, 'utf8'
      orig_str = _str.replace header.token, '$1'

      if conv_str != orig_str
        fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
        util.log "File built: #{conv_fpath}"
        growl "File built: #{conv_fpath}"

  true

# Compress CSS to be minified
# https://github.com/GoalSmashers/clean-css
compressCss = (fpath) ->
  conv_fpath = fpath.replace /\.css$/, '.min.css'
  _str = fs.readFileSync fpath, 'utf8'
  conv_str = cleancss.process _str

  if not fs.existsSync conv_fpath
    fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
    util.log "File minified: #{conv_fpath}"
    growl "File minified: #{conv_fpath}"
  else
    _str = fs.readFileSync conv_fpath, 'utf8'
    orig_str = _str.replace header.token, '$1'

    if conv_str != orig_str
      fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
      util.log "File minified: #{conv_fpath}"
      growl "File minified: #{conv_fpath}"

  true

# Compress JavaScript to be minified
compressJs = (fpath) ->
  conv_fpath = fpath.replace /\.js$/, '.min.js'
  _str = fs.readFileSync fpath, 'utf8'
  ast = uglifyjs.parser.parse _str
  ast = uglifyjs.uglify.ast_mangle ast
  ast = uglifyjs.uglify.ast_squeeze ast
  conv_str = uglifyjs.uglify.gen_code ast

  if not fs.existsSync conv_fpath
    fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
    util.log "File minified: #{conv_fpath}"
    growl "File minified: #{conv_fpath}"
  else
    _str = fs.readFileSync conv_fpath, 'utf8'
    orig_str = _str.replace header.token, '$1'

    if conv_str != orig_str
      fs.writeFileSync conv_fpath, header.msg + conv_str, 'utf8'
      util.log "File minified: #{conv_fpath}"
      growl "File minified: #{conv_fpath}"

  true

optipng = (callback) ->
  for file in (getFiles './img', /\.png$/)
    exec = spawn 'optipng'
    , ['-backup', '-clobber', '-preserve', '-dir', './img', file]

    exec.stderr.on 'data', (data) ->
      util.error data.toString()

    exec.stdout.on 'data', (data) ->
      util.log data.toString()

    exec.on 'exit', (code) ->
      callback?() if code is 0
  true

# Launch local static server
# https://gist.github.com/701407
serve = (port) ->
  http.createServer (req, res) ->
    uri = url.parse(req.url).pathname
    filename = path.join process.cwd(), uri

    resError = (code, err) ->
      res.writeHead code, { 'Content-type': 'text/plain' }
      res.write "#{err}\n"
      res.end()

    path.exists filename, (exists) ->
      return resError 404, 'Not found\n' if not exists

      fs.stat filename, (err, stats) ->
        return resError 500, err if err
        filename = "#{filename}/index.html" if stats.isDirectory()

        fs.readFile filename, 'binary', (err, file) ->
          return resError 500, err if err
          res.writeHead 200
          res.write file, 'binary'
          res.end()
  .listen port

  util.log "Static server running at: http://localhost:#{port}"
  growl "Static server running at: http://localhost:#{port}"

task 'build', 'Build from CoffeeScript, Jade, & Stylus files', ->
  for target in targets
    convertCoffee file for file in (getFiles target, /\.coffee$/)
    convertJade file for file in (getFiles target, /^[^_].*\.jade$/)
    convertStyl file for file in (getFiles target, /^[^_].*\.styl$/)
  true

task 'minify', 'Minify CSS, & JavaScript files', ->
  invoke 'build'

  for target in targets
    compressCss file for file in (getFiles target, /[^min]\.css$/)
    compressJs file for file in (getFiles target, /[^min]\.js$/)
  true

task 'watch', 'Watch file changes and build them automatically', ->
  files = []
  for target in targets
    [].push.apply files, (getFiles target, /\.coffee$/)
    [].push.apply files, (getFiles target, /^[^_].*\.jade$/)
    [].push.apply files, (getFiles target, /^[^_].*\.styl$/)
    [].push.apply files, (getFiles target, /[^min]\.css$/)
    [].push.apply files,  (getFiles target, /[^min]\.js$/)

  for file in files
    do (file) ->
      # TODO: Use this if stable enough in OS X
      #fs.watch file, (ev, f) ->
      #  if 'change' == ev
      fs.watchFile file, (curr, prev) ->
        if +curr.mtime != +prev.mtime
          util.log "Changes detected: #{file}"
          growl "Changes detected: #{file}"
          convertCoffee file if file.match(/\.coffee$/)
          convertJade file if file.match(/\.jade$/)
          convertStyl file if file.match(/\.styl$/)
          compressCss file if file.match(/[^min]\.css$/)
          compressJs file if file.match(/[^min]\.js$/)
        true
      true
  true

task 'open', 'Open index page with default UA', ->
  spawn 'open', ['./index.html']
  invoke 'watch'

task 'optipng', 'Optimize PNG files', ->
  optipng()

task 'serve', 'Simple static server for testing', ->
  port = 49513
  serve port
  spawn 'open', ["http://localhost:#{port}/"]