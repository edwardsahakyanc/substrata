/**
 * BaseUser
 */
export interface BaseUser  {
    name: string;
    username: string;
    email: string;
}
/**
 * BaseUserBalance
 */
export interface BaseUserBalance  {
    amount:number,
    action:"withdraw" | "deposit",

}
/**
 * BaseUserBitcoins
 */
export interface BaseUserBitcoins  {
    action:"buy" | "sell",
    amount:number,
}

/**
 * User
 */
export interface User extends BaseUser {
    id: number;
    createdAt:Date,
    bitcoinAmount:number,
    usdBalance :number,
    updatedAt:any,
}