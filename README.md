# Sqltool

A lib for sql build tools

**install**

Need dependencie `mysql`

```ls
npm i sqltool mysql
```

## Usage

```js
const Sql = require('sqltool')
const Op = Sql.Op

console.log(Sql.create('test', { age: 1, name: 'admin' }))
// insert into test(`age`, `name`) values(1, 'admin')

console.log(Sql.insert('test', [
  { name: 'aaa', age: 18 },
  { name: 'bbb', age: 20 },
  { name: 'ccc', age: 25 }
])) // insert into test(`name`, `age`) values('aaa',18), ('bbb',20), ('ccc',25)

console.log(Sql.update('test', { a: 'aaa', b: 10, c: null }, { id: 100, status: Op.raw('is not null') }))
// update test set `a`='aaa', `b`=10, `c`=NULL where `id` = 100 and `status` is not null

console.log(Sql.where({
  $or: [
    { a: Op.lte(10) },
    { b: Op.gte(25) }
  ],
  status: Op.isNotNull()
})) // where (`a` <= 10 or `b` >= 25) and `status` is not null

console.log(Sql.join([
  { table: 'types', as: 't', type: 'left join', on: { 't.id': Op.id('u.typeId'), status: Op.isNotNull() } },
  { table: 'basic', as: 'b', type: 'join', on: { 'b.id': Op.id('u.bId') } }
])) // left join `types` as `t` on `t`.`id` = `u`.`typeId` and `status` is not null join `basic` as `b` on `b`.`id` = `u`.`bId`
```

## API

```ts
interface Op {
  gt (val: any): { oper: string, value: any };
  gte (val: any): { oper: string, value: any };
  lt (val: any): { oper: string, value: any };
  let (val: any): { oper: string, value: any };
  eq (val: any): { oper: string, value: any };
  neq (val: any): { oper: string, value: any };
  between (arr: any[]): { isRaw: boolean, value: string };
  notBetween (arr: any[]): { isRaw: boolean, value: string };
  in (arr: any[]): { isRaw: boolean, value: string };
  notIn (arr: any[]): { isRaw: boolean, value: string };
  like (val: string): { isRaw: boolean, value: string };
  notLike (val: string): { isRaw: boolean, value: string };
  id (val: string, oper?: OperType): { isId: boolean, value: string };
  isNull (): { isRaw: boolean, value: string };
  isNotNull (): { isRaw: boolean, value: string };
  raw (sql: string): { isRaw: boolean, value: string };
}

type OrderType = 'DESC' | 'ASC' | 'desc' | 'asc'
export type OrderFields = { [key: string]: OrderType } | [string, OrderType][]
type OrType = { [key: string]: any }
type AndType = OrType[]
type OperType = '>' | '>=' | '<' | '<=' | '=' | '!='
export type ConditionType = {
  [key: string]: { isId?: boolean, isRaw?: boolean, oper?: OperType, value: string } | string | number | Date;
  $or?: OrType | OrType[];
  $and?: AndType;
}
type OnType = [string, OperType, string] | ConditionType
type JoinType = 'join' | 'inner join' | 'left join' | 'right join'
export type JoinOptions = { type?: JoinType, table: string | { isRaw: boolean, value: string }, as?: string, on?: OnType }[]

declare class Sql {
  static alias (field: string, aliasName: string, isRaw?: boolean): string;
  static escape (value: any): string;
  static escapeId (value: string, isRaw?: boolean): string;
  static raw (sql: string): { toSqlString: () => string };

  static select (fields?: string[]): string;
  static select (fields: { isRaw: boolean, value: string }[]): string;
  static select (fields: [string, string][]): string;
  static join (tables: JoinOptions): string;
  static order (fields: OrderFields): string;
  static group (fields: string[]): string;
  static condition (conds: ConditionType): string[];
  static where (conds: ConditionType): string;
  static having (conds: ConditionType): string;
  static create (table: string, data: { [key: string]: any }): string;
  static insert (table: string, arr: { [key: string]: any }[]): string;
  static update (table: string, data: { [key: string]: any }, conds: ConditionType | null): string;
}

declare namespace Sql {
  export const Op: Op
}

export = Sql
```