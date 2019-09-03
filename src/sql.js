'use strict'
const { raw, escape, escapeId, alias } = require('./utils')

class Sql {
  static alias () {
    return alias.apply(null, arguments)
  }
  
  static escape () {
    return escape.apply(null, arguments)
  }

  static escapeId () {
    return escapeId.apply(null, arguments)
  }

  static raw () {
    return raw.apply(null, arguments)
  }

  static select (fields = []) {
    if (!Array.isArray(fields) || fields.length === 0) {
      return 'select * from'
    }
    const attrs = fields.map(e => {
      // [string, string] or [{isRaw: true, value: 'sql'}, 't']
      if (Array.isArray(e)) {
        const isRaw = (typeof e[0] === 'object' && e[0].isRaw)
        const field = isRaw
          ? `(${Sql.raw(e[0].value).toSqlString()})`
          : e[0]

        return Sql.alias(field, e[1], isRaw)
      }

      if (typeof e === 'object' && e.isRaw) {
        return Sql.raw(e.value).toSqlString()
      }

      return Sql.escapeId(e)
    })

    return 'select ' + attrs.join(', ') + ' from'
  }

  static join (tables = []) {
    if (!Array.isArray(tables) || tables.length === 0) {
      return ''
    }

    const joins = []

    for (const i in tables) {
      const join = tables[i]
      let on = ''

      if (Array.isArray(join.on)) {
        on = ` on ${Sql.escapeId(join.on[0])} ${join.on[1] || '='} ${Sql.escapeId(join.on[2])}`
      } else if (typeof join.on === 'object') {
        const conds = Sql.condition(join.on)
        on = conds.length > 0 ? ` on ${conds.join(' and ')}` : ''
      }

      const table = typeof join.table === 'object' && join.table.isRaw
        ? `(${Sql.raw(join.table.value).toSqlString()})`
        : Sql.escapeId(join.table)

      joins.push(`${join.type || 'join'} ${table} ${join.as ? 'as ' + Sql.escapeId(join.as) : ''}${on}`)
    }

    return joins.length > 0 ? joins.join(' ') : ''
  }

  /**
   * order({ ctime: 'desc' }) => order by ctime desc
   * order([{ a: 'desc' }, { b: 'asc' }]) => order by a desc, b asc
   * **/
  static order (fields) {
    if (typeof fields !== 'object') return ''

    let orders = []

    if (Array.isArray(fields)) {
      orders = fields.map(e => `${Sql.escapeId(e[0])} ${e[1].toLocaleLowerCase()}`)
    } else {
      for (const key in fields) {
        orders.push(`${Sql.escapeId(key)} ${fields[key].toLocaleLowerCase()}`)
      }
    }

    return orders.length > 0  ? 'order by ' + orders.join(', ') : ''
  }

  /**
   * group(['id']) => group by id
   * **/
  static group (fields) {
    if (Array.isArray(fields) && fields.length > 0) {
      return 'group by ' + fields.map(e => Sql.escapeId(e)).join(', ')
    }

    return ''
  }

  static condition (conds) {
    const wheres = []

    for (const key in conds) {
      const value = conds[key]

      // {$or: {}}
      if (key === '$or' && typeof value === 'object') {
        // { $or: [{a:1, b: 2}, {a: 2, b: 3}] } => (a = 1 and b = 2) or (a = 2 and b = 3)
        if (Array.isArray(value) && value.length > 0) {
          const ors = value.map((e) => {
            const items = Sql.condition(e)
            const chunk = items.join(' and ')
            return items.length > 1 ? `(${chunk})` : chunk
          })

          wheres.push(`(${ors.join(' or ')})`)
        } else {
          const ors = Sql.condition(value)

          if (ors.length > 0) wheres.push(`(${ors.join(' or ')})`)
        }
      } else if (key === '$and' && Array.isArray(value)) {
        // { $and: [{}] }
        const ands = value.map(e => {
          const items = Sql.condition(e)
          const chunk = items.join(' and ')
          return items.length > 1 ? `(${chunk})` : chunk
        })

        if (ands.length > 0) wheres.push(`(${ands.join(' and ')})`)
      } else if (typeof value === 'object' && !(value instanceof Date)) {
        // { key: {isId: true, value: 'u.id'} } => key = u.id
        if (value.isId) {
          wheres.push(`${Sql.escapeId(key)} ${value.oper || '='} ${Sql.escapeId(value.value)}`)
        } else if (value.isRaw) {
          wheres.push(`${Sql.escapeId(key)} ${Sql.raw(value.value).toSqlString()}`)
        } else {
          wheres.push(`${Sql.escapeId(key)} ${value.oper || '='} ${Sql.escape(value.value)}`)
        }
      } else {
        wheres.push(`${Sql.escapeId(key)} = ${Sql.escape(value)}`)
      }
    }

    return wheres
  }

  static where (conds) {
    const wheres = Sql.condition(conds)

    if (wheres.length === 0) return ''

    return 'where ' + wheres.join(' and ')
  }

  static having (conds) {
    const wheres = Sql.condition(conds)

    if (wheres.length === 0) return ''

    return 'having ' + wheres.join(' and ')
  }
}

module.exports = Sql
