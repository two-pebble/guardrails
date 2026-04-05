export class MyService {
  // Starts the service
  public start() {
    return true;
  }

  /**
   * Stops the service gracefully.
   */
  public stop() {
    return false;
  }

  private internal() {
    return 0;
  }
}
