/**
 * Required External Modules and Interfaces
 */

import express, {Request, response, Response} from "express";
import * as UserService from "./users.service";
import {BaseUser, BaseUserBalance, User, BaseUserBitcoins} from "./user.interface";
import * as BitcoinService from "../bitcoin/bitcoin.service";

const {check, validationResult} = require('express-validator');

/**
 * Router Definition
 */
export const usersRouter = express.Router();
/**
 * Controller Definitions
 */

// GET users
usersRouter.get("/", async (req: Request, res: Response) => {
    try {
        const items: User[] = await UserService.findAll();

        res.status(200).send(items);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// POST users
usersRouter.post("/",
    check('name', 'invalid name').isLength({
        min: 2
    }),
    check('username', 'invalid username').isLength({
        min: 2
    }),
    check('email', 'invalid email').isEmail(),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Validation incorrect'
                })
            }
            const user: BaseUser = req.body;
            const newUser = await UserService.create(user);
            res.status(201).json(newUser);
        } catch (e) {
            res.status(500).send(e.message);
        }
    });
// GET users/:id
usersRouter.get("/:id", async (req: Request, res: Response) => {

    const id: number = parseInt(req.params.id, 10);
    try {
        const user: User = await UserService.find(id);

        if (user) {
            return res.status(200).send(user);
        }

        res.status(404).send("User not found");
    } catch (e) {
        res.status(500).send(e.message);
    }
});
// PUT users/:id
usersRouter.put("/:id",
    check('name', 'invalid name').isLength({
        min: 2
    }),
    check('username', 'invalid username').isLength({
        min: 2
    }),
    check('email', 'invalid email').isEmail(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Validation incorrect'
            })
        }
        const id: number = parseInt(req.params.id, 10);

        try {
            const userUpdate: User = req.body;

            const existingItem: User = await UserService.find(id);

            if (existingItem) {
                const updatedUser = await UserService.update(id, userUpdate);
                return res.status(200).json(updatedUser);
            }

            const newUser = await UserService.create(userUpdate);

            res.status(201).json(newUser);
        } catch (e) {
            res.status(500).send(e.message);
        }
    });

// DELETE users/:id
usersRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await UserService.remove(id);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});
// Post users/:id/usd
usersRouter.post("/:id/usd",
    check('action','action invalid').isIn(['withdraw', 'deposit']),
    check('amount','amount invalid').isNumeric(),
    async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Validation incorrect'
            })
        }
        const id: number = parseInt(req.params.id, 10);
        const userBalanceUpdate: BaseUserBalance = req.body;
        const existingItem: User = await UserService.find(id);

        if (existingItem) {
            const updatedUser = await UserService.usd(id, userBalanceUpdate);
            return res.status(200).json(updatedUser);
        }
    } catch (e) {

        res.status(500).send(e.message);
    }
});
// Post users/:id/bitcoins
usersRouter.post("/:id/bitcoins",
    check('action','action invalid').isIn(['buy', 'sell']),
    check('amount','amount invalid').isNumeric(),
    async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Validation incorrect'
            })
        }
        const id: number = parseInt(req.params.id, 10);
        const userBitcoinsUpdate: BaseUserBitcoins = req.body;
        const existingItem: User = await UserService.find(id);
        if (existingItem) {

            const updatedUserBitcoins = await UserService.bitcoins(id, userBitcoinsUpdate);
            return res.status(200).json(updatedUserBitcoins);
        }
    } catch (e) {

        res.status(500).send(e.message);
    }
});
// GET users/:id/balance
usersRouter.get("/:id/balance", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const user: User = await UserService.find(id);
        if (user) {
            const bitcoin = await BitcoinService.find();
            let userBalance: any = {};
            userBalance.balance = (user.bitcoinAmount * bitcoin.price) + user.usdBalance;
            userBalance.success = true;

            return res.status(200).json(userBalance);
        }
        res.status(404).send("User not found");
    } catch (e) {
        res.status(500).send(e.message);
    }
});