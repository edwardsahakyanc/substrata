/**
 * Data Model Interfaces
 */
import {BitcoinInterface, BaseBitcoin} from "./bitcoin.interface";

/**
 * In-Memory Store
 */
let bitcoin = {
    'price':  100.00,
    'updatedAt': new Date('2021-01-04T00:12:01.000Z')
};
/**
 * Service Methods
 */
export const find = async (): Promise<BitcoinInterface> => bitcoin;
export const update = async (
    bitcoinUpdate: BaseBitcoin
): Promise<BitcoinInterface | null> => {

    bitcoin = {
        updatedAt: new Date(),
        ...bitcoinUpdate
    };

    return bitcoin;
};
