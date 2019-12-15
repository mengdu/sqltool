const Sql = require('./sql')

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

  findAll (options) {
  }

  findOne (options) {}

  count (conds) {}

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
