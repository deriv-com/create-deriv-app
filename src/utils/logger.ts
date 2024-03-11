import chalk from "chalk";

export const info = (message: string) => console.log(chalk.cyan(message));
export const error = (message: string) => console.log(chalk.red(message));
