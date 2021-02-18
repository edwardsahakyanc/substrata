/**
 * Data Model Interfaces
 */

import {BaseUser, User, BaseUserBalance, BaseUserBitcoins} from "./user.interface";
import {Users} from "./users.interface";
import ErrorHandler from '../models/ErrorHandler';
import * as BitcoinService from "../bitcoin/bitcoin.service";

/**
 * In-Memory Store
 */

let users: Users = {
    1: {
        id: 1,
        name: "Jon A",
        username: 'jonjon',
        email: "jon@jmail.com",
        createdAt: new Date(),
        bitcoinAmount: 0,
        usdBalance: 0,
        updatedAt: null

    },
    2: {
        id: 2,
        name: "User 2",
        username: "user2",
        email: "user2@mail.com",
        createdAt: new Date(),
        bitcoinAmount: 0,
        usdBalance: 0,
        updatedAt: null


    },
    3: {
        id: 3,
        name: "User3",
        username: "user3",
        email: "user3@mail.com",
        createdAt: new Date(),
        bitcoinAmount: 0,
        usdBalance: 0,
        updatedAt: null


    }
};
/**
 * Service Methods
 */

export const findAll = async (): Promise<User[]> => Object.values(users);
/**
 *
 * @param id
 */
export const find = async (id: number): Promise<User> => users[id];
/**
 *
 * @param newUser
 */
export const create = async (newUser: BaseUser): Promise<User> => {
    const id = new Date().valueOf();
    users[id] = {
        id,
        createdAt: new Date(),
        bitcoinAmount: 0,
        usdBalance: 0,
        updatedAt: null,
        ...newUser,
    };

    return users[id];
};
/**
 *
 * @param id
 * @param userUpdate
 */
export const update = async (
    id: number,
    userUpdate: BaseUser
): Promise<User | null> => {
    const user = await find(id);

    if (!user) {
        return null;
    }

    users[id] = {
        id,
        createdAt: user.createdAt,
        updatedAt: new Date(),
        bitcoinAmount: user.bitcoinAmount,
        usdBalance: user.usdBalance,
        ...userUpdate
    };

    return users[id];
};
/**
 *
 * @param id
 */
export const remove = async (id: number): Promise<null | void> => {
    const user = await find(id);

    if (!user) {
        return null;
    }

    delete users[id];
};
/**
 *
 * @param id
 * @param balanceUsdUpdate
 */
export const usd = async (
    id: number,
    balanceUsdUpdate: BaseUserBalance,
): Promise<User | null> => {
    const user = await find(id);
    let balanceUsd;
    if (!user) {
        throw new ErrorHandler(501, `such user does not exist`);

    }
    if (balanceUsdUpdate && balanceUsdUpdate.action === 'withdraw') {
        if(user.usdBalance < balanceUsdUpdate.amount){
            throw new ErrorHandler(422 , `Your score is not enough.You have ${user.usdBalance} do you want to be filmed ${balanceUsdUpdate.amount}`);
        }
        balanceUsd = user.usdBalance - balanceUsdUpdate.amount
    } else if (balanceUsdUpdate && balanceUsdUpdate.action === 'deposit') {

        balanceUsd = user.usdBalance + balanceUsdUpdate.amount
    } else {
        balanceUsd = user.usdBalance

    }
    const bitcoin = await BitcoinService.find();
    users[id] = {
        id,
        createdAt: user.createdAt,
        updatedAt: new Date(),
        bitcoinAmount: user.bitcoinAmount,
        name: user.name,
        username: user.username,
        email: user.email,
        usdBalance: balanceUsd,
    };

    return users[id];
};
/**
 *
 * @param id
 * @param bitcoinUpdate
 */
export const bitcoins = async (
    id: number,
    bitcoinUpdate: BaseUserBitcoins,
): Promise<User | null> => {
    const user = await find(id);
    if (!user) {
        throw new ErrorHandler(501, `Such user does not exist`);

    }
    let userBitcoin=user.bitcoinAmount;
    const bitcoin = await BitcoinService.find();

    if (bitcoinUpdate && bitcoinUpdate.action === 'buy') {
        let bitcoinToUsd = bitcoinUpdate.amount*bitcoin.price;
        if(bitcoinToUsd>user.usdBalance){
            throw new ErrorHandler(422 , `Your score is not enough.You have ${user.bitcoinAmount}you cannot buy that much bitcoin}`);
        }
        userBitcoin+=bitcoinUpdate.amount;
         user.usdBalance-=bitcoinToUsd;

    }
    if (bitcoinUpdate && bitcoinUpdate.action === 'sell') {
        let bitcoinToUsd = bitcoinUpdate.amount*bitcoin.price;

        if(user.bitcoinAmount < bitcoinUpdate.amount){
            throw new ErrorHandler(422 , `Your score is not enough.You have ${user.bitcoinAmount} do you want to be filmed ${bitcoinUpdate.amount}`);
        }
        userBitcoin=user.bitcoinAmount-bitcoinUpdate.amount;
        user.usdBalance+=bitcoinToUsd;
    }
    users[id] = {
        id,
        createdAt: user.createdAt,
        updatedAt: new Date(),
        bitcoinAmount: userBitcoin,
        name: user.name,
        username: user.username,
        email: user.email,
        usdBalance: user.usdBalance,
    };

    return users[id];
};
