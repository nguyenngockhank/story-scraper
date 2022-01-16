import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Delete,
} from "@nestjs/common";
import { DeleteTransactionUC } from "../use-cases/DeleteTransactionUC";
import { GetTransactionByIdUC } from "../use-cases/GetTransactionByIdUC";
import { GetTransactionsByDateUC } from "../use-cases/GetTransactionsByDateUC";
import { TransferTransactionUC } from "../use-cases/TransferTransactionUC";
@Controller()
export class WalletController {
  constructor(
    private getTransactionsByDateUC: GetTransactionsByDateUC,
    private getTransactionByIdUC: GetTransactionByIdUC,
    private transferTransactionUC: TransferTransactionUC,
    private deleteTransactionUC: DeleteTransactionUC,
  ) {}

  @Get("api/wallet/:walletId/:date/txs")
  txOnDate(@Param("walletId") walletId: string, @Param("date") date: string) {
    return this.getTransactionsByDateUC.execute(walletId, date);
  }

  @Get("api/wallet/transaction/:txId")
  async getTxDetail(@Param("txId") txId: string) {
    const tx = await this.getTransactionByIdUC.execute(txId);
    if (!tx) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return tx;
  }

  @Put("api/wallet/transaction/:txId")
  transfer(@Param("txId") txId: string) {
    return this.transferTransactionUC.execute(txId);
  }

  @Delete("api/wallet/transaction/:txId")
  deleteTx(@Param("txId") txId: string) {
    return this.deleteTransactionUC.execute(txId);
  }
}
