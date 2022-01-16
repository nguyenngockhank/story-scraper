import { Inject } from "../../Shared/domain/AppContainer";
import { TransactionRepo } from "../domain/TransactionRepo";
import { walletItems } from "../domain/WalletContainer";

export class TransferTransactionUC {
  private targetWalletId = "CB14ECDBC1FC40C2A5B2FE35A2D0D9B4"; // quynho
  private categoryMapping: Record<string, string> = {
    // giai tri
    "3cc0e07b639e4507a1297be1a89cae9f": "B26D04FC79204BD9ADC5EB0ED2DAA980",
    // dinner
    E54AC5BBCC19434ABE461615E0800247: "e2c93e1d504b4024bb0e282daf9ed10a",
    // breakfast
    "3D9ABB1B13DD4BD199371FEBE773A5DE": "web1cf41a2b54da2ac7e4836314c4b38",
    // lunch
    E5CC16628BBD4316AA4B7FBB9D548123: "7414448F606D4172A6969DD8AA10395F",
    // cafe
    D9EFEA65C6B84F83AC268F1D40693877: "EA6704E3EAB44BF79C1EDED420D43378",
    // do an vat => an uong
    FFA9FAE6018941D68289B060D1F17361: "390AC66476724BC9B1F314988D6E9605",
    // che chao
    FDCFFB6A474946EF91D9868DC26167EC: "webdf77af4a745b5aa381ec7898be7c9",
    // phim => movie
    E6A53D80AABD4CBFB2428BCDF8DE7956: "8CA32698B6714B51839240362AC71EBC",
    // qua tang
    "37bdc8557e974b819c2664c2ad59680a": "5E39CF2992BA497FB6847D232FAC38D2",
    // do choi
    "86B64C4E33FA45308C4FC63A404447DB": "5E39CF2992BA497FB6847D232FAC38D2",
    // mua sam
    "054b9fadbd074796903753605abcbcca": "5E39CF2992BA497FB6847D232FAC38D2",

    // suaxa -> bao duong
    BE681E0AF3D842FEAA63CC043DACC97C: "93442B3D6ACF477FBA2895FD798C6E6D",
  };

  constructor(
    @Inject(walletItems.TransactionRepo)
    private txRepo: TransactionRepo,
  ) {}
  async execute(txId: string): Promise<string | null> {
    const tx = await this.txRepo.getById(txId);
    if (tx.walletId === this.targetWalletId) {
      throw new Error("Already in target wallet");
    }

    const targetCategoryId = this.categoryMapping[tx.category.id];
    if (!targetCategoryId) {
      throw new Error("No mapping for category id " + tx.category.id);
    }

    // insert new one, delete old one
    const createPayload = {
      displayDate: tx.displayDate,
      amount: tx.amount,
      walletId: this.targetWalletId,
      categoryId: targetCategoryId,
      note: tx.note,
    };
    const newTxId = await this.txRepo.createTransaction(createPayload);
    await this.txRepo.deleteTransaction(txId);

    return newTxId;
  }
}
