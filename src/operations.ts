import NeDB from "nedb-promises";
import { POST_LIMIT, TIME_LIMIT } from "./config";

type Document = {
	chatID: number;
	valid: boolean;
	date: number;
	count: number;
	fileID: string[];
};

type DB = ReturnType<typeof NeDB.create>;

export const getTimeLeft = (date: number) => new Date().getTime() - date;
export const timeLeft = TIME_LIMIT * 60 * 60;

export const getUserByID = async (db: DB, chatID: number) => {
	const user: Document = await db.findOne({ chatID });
	if (user) return user;
	const newUser = {
		count: 0,
		date: new Date().getTime(),
		chatID,
		fileID: [],
		valid: true
	};
	await db.insert(newUser);
	return newUser;
};

export const getLastPostDateStatus = async (
	db: DB,
	chatID: number
): Promise<{ status: boolean; time: number }> => {
	const user = await getUserByID(db, chatID);
	const timeLeft = getTimeLeft(user.date);
	if (timeLeft < TIME_LIMIT && user.count > POST_LIMIT) {
		await resetUser(db, chatID);
		return { status: true, time: 0 };
	}
	return { status: false, time: Math.ceil(timeLeft / 60 / 60) };
};

export const addFile = async (db: DB, chatID: number, fileID: string) => {
	await db.update(
		{ chatID },
		{ $inc: { count: 1 }, $set: { valid: false }, $push: { fileID } }
	);
};

export const resetUser = async (db: DB, chatID: number) => {
	await db.update(
		{ chatID },
		{ $set: { count: 0, date: new Date().getTime() } }
	);
};

export const incrementPostCountByID = async (
	db: DB,
	chatID: number,
	valid = false
) => {
	await db.update({ chatID }, { $set: { valid }, $inc: {count: 1} });
};
