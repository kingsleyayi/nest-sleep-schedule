import Logger  from "./logger";

class eventLogger {
  public static async error(message: string) {
    Logger.error(`${message}`);
  }

  public static async warn(message: string) {
    Logger.warn(`${message}`);
  }

  public static async info(message: string) {
    Logger.info(`${message}`);
  }

  public static async http(message: string) {
    Logger.http(`${message}`);
  }

  public static async debug(message: string) {
    Logger.debug(`${message}`);
  }
}

export default eventLogger;