'use strict'
const { escape, trim } = require('./utils')

class Op {
  static gt (val) {
    return { oper: '>', value: val }
  }

  static gte (val) {
    return { oper: '>=', value: val }
  }

  static lt (val) {
    return { oper: '<', value: val }
  }

  static lte (val) {
    return { oper: '<=', value: val }
  }

  static eq (val) {
    return { oper: '=', value: val }
  }

  static neq (val) {
    return { oper: '!=', value: val }
  }

  static between (arr) {
    return { isRaw: true, value: `between ${escape(arr[0])} and ${escape(arr[1])}` }
  }

  static notBetween (arr) {
    return { isRaw: true, value: `not between ${escape(arr[0])} and ${escape(arr[1])}` }
  }

  static in (arr) {
    return { isRaw: true, value: `in(${arr.map(e => escape(e)).join(', ')})` }
  }

  static notIn (arr) {
    return { isRaw: true, value: `not in(${arr.map(e => escape(e)).join(', ')})` }
  }

  static like (val) {
    return { isRaw: true, value: `like ${escape(val)}` }
  }

  static notLike (val) {
    return { isRaw: true, value: `like ${escape(val)}` }
  }

  static id (val, oper = '=') {
    return { isId: true, oper, value: trim(val) }
  }

  static isNull () {
    return { isRaw: true, value: 'is null' }
  }

  static isNotNull () {
    return { isRaw: true, value: 'is not null' }
  }

  static raw (sql) {
    return { isRaw: true, value: sql }
  }
}

module.exports = Op
