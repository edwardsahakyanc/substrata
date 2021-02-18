/**
 * BaseBitcoin
 */
export interface BaseBitcoin  {
    price:number,

}
/**
 * BitcoinInterface
 */
export interface BitcoinInterface  extends BaseBitcoin{
    updatedAt:Date
}