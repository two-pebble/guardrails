interface Options {
  verbose: boolean;
}

type Mode = "fast" | "slow";

export class MyService {
  run(opts: Options, mode: Mode) {
    return opts.verbose && mode === "fast";
  }
}
