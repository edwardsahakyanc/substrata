/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as BitcoinService from "./bitcoin.service";
import { BitcoinInterface, BaseBitcoin } from "./bitcoin.interface";
const {check, validationResult} = require('express-validator');

/**
 * Router Definition
 */
export const bitcoinRouter = express.Router();
/**
 * Controller Definitions
 */

// GET bitcoin
bitcoinRouter.get("/", async (req: Request, res: Response) => {
    try {
        const bitcoin: BitcoinInterface = await BitcoinService.find();

        res.status(200).send(bitcoin);
    } catch (e) {
        res.status(500).send(e.message);
    }
});
// PUT bitcoin
bitcoinRouter.put("/",
    check('price','price invalid').isNumeric(),
    async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Validation incorrect'
            })
        }
        const bitcoinUpdate: BitcoinInterface = req.body;
        const existingItem: BitcoinInterface = await BitcoinService.find();

        if (existingItem) {
            const updatedBitcoin= await BitcoinService.update(bitcoinUpdate);
            return res.status(200).json(updatedBitcoin);
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});
