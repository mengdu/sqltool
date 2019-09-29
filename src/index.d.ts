// This .d.ts file is used for code prompts

interface Op {
  gt (val: any): { oper: string, value: any };
  gte (val: any): { oper: string, value: any };
  lt (val: any): { oper: string, value: any };
  lte (val: any): { oper: string, value: any };
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
export type CreateConds = { isRaw: boolean, value: string }
  | { exists: { where?: ConditionType, table?: string } }
  | { notExists: { where?: ConditionType, table?: string } }

declare class Sql {
  static alias (field: string, aliasName: string, isRaw?: boolean): string;
  static escape (value: any): string;
  static escapeId (value: string, isRaw?: boolean): string;
  static raw (sql: string): { toSqlString: () => string };

  static select (fields?: string[], table?: string): string;
  static select (fields: { isRaw: boolean, value: string }[], table?: string): string;
  static select (fields: [string, string][], table?: string): string;
  static join (tables: JoinOptions): string;
  static order (fields: OrderFields): string;
  static group (fields: string[]): string;
  static condition (conds: ConditionType): string[];
  static where (conds: ConditionType): string;
  static having (conds: ConditionType): string;
  static create (table: string, data: { [key: string]: any }, conds?: CreateConds, ignore?: boolean): string;
  static insert (table: string, arr: { [key: string]: any }[], ignore?: boolean): string;
  static update (table: string, data: { [key: string]: any }, conds: ConditionType | null): string;
}

declare namespace Sql {
  export const Op: Op
}

export = Sql
