'use strict'
const sqlstring = require('sqlstring')

function trim (val) {
  return val.trim()
}

function escapeId (value, isRaw) {
  const [field, aliasName] = value.split(/\s+as\s+/)
  return aliasName ? alias(field, aliasName, isRaw) : sqlstring.escapeId(trim(field)).replace(/`\*`/, '*') // mysql 5.6 以下版本不支持 `*` 列
}

function alias (field, aliasName, isRaw) {
  return (isRaw ? trim(field) : escapeId(trim(field))) + ' as ' + escapeId(trim(aliasName))
}

function escape (value) {
  return sqlstring.escape(value)
}

function raw (sql) {
  return sqlstring.raw(sql)
}

exports.trim = trim
exports.escapeId = escapeId
exports.escape = escape
exports.raw = raw
exports.alias = alias
exports.format = sqlstring.format
