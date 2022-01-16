import { Inject } from "../../Shared/domain/AppContainer";
import { Transaction, TransactionRepo } from "../domain/TransactionRepo";
import { walletItems } from "../domain/WalletContainer";

export class GetTransactionsByDateUC {
  constructor(
    @Inject(walletItems.TransactionRepo)
    private txRepo: TransactionRepo,
  ) {}
  execute(walletId: string, date: string): Promise<Transaction[]> {
    return this.txRepo.getListOfDate(walletId, date);
  }
}
