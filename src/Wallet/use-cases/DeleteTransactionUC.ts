import { Inject } from "../../Shared/domain/AppContainer";
import { TransactionRepo } from "../domain/TransactionRepo";
import { walletItems } from "../domain/WalletContainer";

export class DeleteTransactionUC {
  constructor(
    @Inject(walletItems.TransactionRepo)
    private txRepo: TransactionRepo,
  ) {}
  async execute(txId: string): Promise<void> {
    await this.txRepo.deleteTransaction(txId);
  }
}
