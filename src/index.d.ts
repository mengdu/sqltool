// This .d.ts file is used for code prompts

declare type OrderString = 'DESC' | 'ASC' | 'desc' | 'asc'

declare type OrderFields = { [key: string]: OrderString } | [string, OrderString][]

declare type OperateType = '>' | '>=' | '<' | '<=' | '=' | '!='
declare interface Op {
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
  id (val: string, oper?: OperateType): { isId: boolean, value: string };
  isNull (): { isRaw: boolean, value: string };
  isNotNull (): { isRaw: boolean, value: string };
  raw (sql: string): { isRaw: boolean, value: string };
}

declare interface RawValue {
  isId?: boolean;
  isRaw?: boolean;
  oper?: OperateType;
  value: string;
}

declare interface DefaultCondition {
  [key: string]: any;
}

declare type KeyValue = RawValue | string | number | Date | DefaultCondition;

declare type OrType = { [key: string]: KeyValue  }
declare type AndType = OrType[]

declare interface ConditionType extends DefaultCondition {
  [key: string]: KeyValue;
  $or?: OrType;
  $and?: AndType;
}

declare type OnType = [string, OperateType, string] | ConditionType
declare type JoinType = 'join' | 'inner join' | 'left join' | 'right join'
declare type JoinOptions = { type?: JoinType, table: string | { isRaw: boolean, value: string }, as?: string, on?: OnType }[]
declare type CreateConds = { isRaw: boolean, value: string }
  | { exists: { where?: ConditionType, table?: string } }
  | { notExists: { where?: ConditionType, table?: string } }

declare class Sql {
  static Op:Op;
  static alias: (field: string, aliasName: string, isRaw?: boolean) => string;
  static escape: (value: any) => string;
  static escapeId: (value: string, isRaw?: boolean) => string;
  static raw: (sql: string) => { toSqlString: () => string };
  static format: (sql: string, params: object | any[]) => string;
  static select: (fields?: string[] | { isRaw: boolean, value: string }[] | [string, string][], table?: string) => string;
  static join: (tables: JoinOptions) => string;
  static order: (fields: OrderFields) => string;
  static group: (fields: string[]) => string;
  static condition: (conds: ConditionType) => string[];
  static where: (conds: ConditionType) => string;
  static having: (conds: ConditionType) => string;
  static create: (table: string, data: { [key: string]: any }, conds?: CreateConds, ignore?: boolean) => string;
  static insert: (table: string, arr: { [key: string]: any }[], ignore?: boolean) => string;
  static update: (table: string, data: { [key: string]: any }, conds: ConditionType | null) => string;
}

export default Sql
