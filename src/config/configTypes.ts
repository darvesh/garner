export interface Config {
	TOKEN: string;
	TIME_LIMIT: number;
	POST_LIMIT: number;
	OWNER_ID: number;
	CONTENT_QUALITY: "minimum" | "maximum";
	COMMANDS: [string, string][];
}
