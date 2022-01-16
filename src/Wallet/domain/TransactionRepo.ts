export type Transaction = {
  id: string;
  amount: number;
  walletId: string;
  category: {
    id: string;
    name: string;
  };
  note: string;
  with: string[];
  displayDate: string;
  createdAt: string;
};

export type CreatePayload = {
  displayDate: string; // yyyy-mm-dd
  amount: number;
  walletId: string; // account
  categoryId: string;
  note: string;
};

export interface TransactionRepo {
  getListOfDate(walletId: string, date: string): Promise<Transaction[]>;
  getById(txId: string): Promise<Transaction | null>;
  createTransaction(payload: CreatePayload): Promise<string>;
  deleteTransaction(txId: string): Promise<void>;
}
