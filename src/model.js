const Sql = require('./sql')

function isUndefined (v) {
  return typeof v === 'undefined'
}

class BaseModel {
  constructor (tableName, connect) {
    this.$name = tableName
    this.$connect = connect
  }

  async create (data, conds = null, ignore = false) {
    const sql = Sql.create(this.$name, data, conds, ignore)
    const result = await this.exec(sql)

    return result
  }

  async insert (arr, ignore = false) {
    const sql = Sql.insert(this.$name, arr, ignore)
    const result = await this.exec(sql)

    return result
  }

  async update (data, conds = null) {
    const sql = Sql.update(this.$name, data, conds)
    const result = await this.exec(sql)

    return result
  }

  async delete (conds) {
    const sql = `delete from ${this.$name} ${Sql.where(conds)}`
    const result = await this.exec(sql)

    return result
  }

  findAll (opt = { attrs: [], joins: [], where: {}, order: [], group: [] }) {
    return new Promise((resolve, reject) => {
      const options = {
        attrs: this.$attrs,
        joins: [],
        where: {},
        group: [], // ['key', 'key']
        having: {},
        order: [], // [['key', 'desc']]
        // aliasName: '',
        // limit?: 0,
        // offset?: 0,
        ...opt
      }
      const select = Sql.select(options.attrs)
      const join = Sql.join(options.joins)
      const where = Sql.where(options.where)
      const having = Sql.having(options.having)
      const order = Sql.order(options.order)
      const group = Sql.group(options.group)

      let limit = ''

      if (!isUndefined(options.limit) && isUndefined(options.offset)) {
        limit = `limit ${+options.limit}`
      } else if (!isUndefined(options.limit) && !isUndefined(options.offset)) {
        limit = `limit ${+options.offset}, ${+options.limit}`
      } else {
        limit = ''
      }

      const sqls = [
        `${select} ${options.aliasName ? Sql.alias(this.$name, options.aliasName) : Sql.escapeId(this.$name)}`,
        join,
        where,
        group,
        having,
        order,
        limit
      ]

      const sql = sqls.filter(e => !!e).join(' ')

      this.exec(sql).then(result => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  }

  async findOne (options) {
    const list = await this.findAll({
      ...options,
      limit: 1
    })

    return list[0] || null
  }

  async count (options) {
    const list = await this.findAll({
      attrs: [{ isRaw: true, value: 'count(*) as `count`' }],
      ...options
    })

    return list[0].count
  }

  exec (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.$connect.query(sql, params, (err, result) => {
        if (err) return reject(err)

        resolve(result)
      })
    })
  }
}

module.exports = BaseModel
