import { Module } from "@nestjs/common";
import { TransactionRepoImpl } from "./TransactionRepoImpl";
import { walletItems } from "../domain/WalletContainer";
import { WalletController } from "./wallet.controller";
import { GetTransactionsByDateUC } from "../use-cases/GetTransactionsByDateUC";
import { GetTransactionByIdUC } from "../use-cases/GetTransactionByIdUC";
import { TransferTransactionUC } from "../use-cases/TransferTransactionUC";
import { DeleteTransactionUC } from "../use-cases/DeleteTransactionUC";

@Module({
  controllers: [WalletController],
  providers: [
    {
      provide: walletItems.AccessToken,
      useValue: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzLXRva2VuIiwidXNlcklkIjoiNTZkMmVkMzQ1MjE2YWZhZjRmN2JjZjIwIiwidG9rZW5EZXZpY2UiOiIwZWE1ZWM4Ny03OWQyLTRjMWItYTY5ZC0yOTIyYTI5Y2IxOWYiLCJjbGllbnRJZCI6IjVhY2FmMzA0YWE2Y2M1MGM3N2Y3ZDIyOCIsImNsaWVudCI6ImtIaVpiRlFPdzVMViIsInNjb3BlcyI6bnVsbCwiaWF0IjoxNjM5ODMzNTU5LCJleHAiOjE2NDA0MzgzNTl9.bE8u3sK2L4Nt_K6KiDGhbUoNYZ_d-oDgofpPNYhSzQs`,
    },
    {
      provide: walletItems.TransactionRepo,
      useClass: TransactionRepoImpl,
    },
    // usecase
    GetTransactionsByDateUC,
    GetTransactionByIdUC,
    TransferTransactionUC,
    DeleteTransactionUC,
  ],
  exports: [],
})
export class WalletModule {}
