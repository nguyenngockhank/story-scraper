export interface MyDatastore<T> {
  insert(items: Array<Partial<T>> | Partial<T>): Promise<void>;
  findAll(): Promise<Array<T>>;
  findMany(criteria: Partial<T>): Promise<Array<T>>;
  findFirst(criteria: Partial<T>): Promise<Partial<T> | null>;
}
