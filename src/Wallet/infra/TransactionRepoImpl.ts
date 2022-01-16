import {
  CreatePayload,
  Transaction,
  TransactionRepo,
} from "../domain/TransactionRepo";
import axios from "axios";
import { walletItems } from "../domain/WalletContainer";
import { Inject } from "../../Shared/domain/AppContainer";
import {
  NedbDatastore,
  NedbDatastoreFactory,
} from "../../Shared/infra/Datastore/NedbDatastoreFactory";
import { withTryCatch } from "./withTryCatch";

export class TransactionRepoImpl implements TransactionRepo {
  private BASE_API = "https://web.moneylover.me/api";
  private localStorage: NedbDatastore<any>;

  constructor(
    @Inject(walletItems.AccessToken) private accessToken: string,
    nedbFactory: NedbDatastoreFactory,
  ) {
    const datastore = nedbFactory.create<Transaction>({
      path: `db/wallet/transactions`,
    });
    datastore._nedb.ensureIndex({ fieldName: "id", unique: true });
    this.localStorage = datastore;
  }
  async getById(txId: string): Promise<Transaction | null> {
    const result: Transaction | null = await this.localStorage.findFirst({
      id: txId,
    });

    return result;
  }

  async getListOfDate(walletId: string, date: string): Promise<Transaction[]> {
    const result: any = await this.callApi(`/transaction/list`, {
      walletId,
      startDate: `${date}T00:00:00+07:00`,
      endDate: `${date}T23:59:59+07:00`,
    });

    const txList = result.data.transactions.map((item: any): Transaction => {
      return {
        id: item._id,
        walletId: walletId,
        note: item.note,
        with: item.with,
        amount: item.amount,
        displayDate: item.displayDate,
        createdAt: item.createdAt,
        category: {
          id: item.category._id,
          name: item.category.name,
        },
      };
    });

    // save
    txList.map((item) => withTryCatch(() => this.localStorage.insert(item)));

    return txList;
  }
  async createTransaction(payload: CreatePayload): Promise<string> {
    const result: any = await this.callApi(`/transaction/add`, {
      account: payload.walletId,
      category: payload.categoryId,
      amount: payload.amount,
      note: payload.note,
      displayDate: payload.displayDate,
      with: [],
      event: "",
      exclude_report: false,
      longtitude: 0,
      latitude: 0,
      addressName: "",
      addressDetails: "",
      addressIcon: "",
      image: "",
    });

    const txId = result.data._id;
    return txId;
  }
  async deleteTransaction(txId: string): Promise<void> {
    await this.callApi(`/transaction/delete`, {
      _id: txId,
      delRelated: false,
    });

    await withTryCatch(() => this.localStorage.remove({ id: txId }));
  }

  async callApi<Y, T>(path: string, payload: T): Promise<Y> {
    console.log(">> call api", path, payload);
    const response = await axios.post(`${this.BASE_API}${path}`, payload, {
      headers: {
        authorization: `AuthJWT ${this.accessToken}`,
      },
    });
    console.log(">> response: ", response.data);
    return response.data as Y;
  }
}
