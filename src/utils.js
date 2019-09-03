'use strict'
const mysql = require('mysql')

function trim (val) {
  return val.trim()
}

function escapeId (value, isRaw) {
  const [field, aliasName] = value.split(/\s+as\s+/)
  return aliasName ? alias(field, aliasName, isRaw) : mysql.escapeId(trim(field)).replace(/`\*`/, '*') // mysql 5.6 以下版本不支持 `*` 列
}

function alias (field, aliasName, isRaw) {
  return (isRaw ? trim(field) : escapeId(trim(field))) + ' as ' + escapeId(trim(aliasName))
}

function escape (value) {
  return mysql.escape(value)
}

function raw (sql) {
  return mysql.raw(sql)
}

exports.trim = trim
exports.escapeId = escapeId
exports.escape = escape
exports.raw = raw
exports.alias = alias
