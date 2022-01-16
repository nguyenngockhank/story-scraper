export interface MyDatastore<T> {
  insert(items: Array<Partial<T>> | Partial<T>): Promise<void>;
  findAll(): Promise<Array<T>>;
  findMany(criteria: Partial<T>): Promise<Array<T>>;
  findFirst(criteria: Partial<T>): Promise<T | null>;
  remove(criteria: Partial<T>): Promise<void>;
}
