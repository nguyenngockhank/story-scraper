import { Inject } from "../../Shared/domain/AppContainer";
import { Transaction, TransactionRepo } from "../domain/TransactionRepo";
import { walletItems } from "../domain/WalletContainer";

export class GetTransactionByIdUC {
  constructor(
    @Inject(walletItems.TransactionRepo)
    private txRepo: TransactionRepo,
  ) {}
  execute(txId: string): Promise<Transaction | null> {
    return this.txRepo.getById(txId);
  }
}
