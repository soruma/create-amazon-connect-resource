import cac from 'cac';

/**
 * A simple index signature for parsed CLI output,
 * hiding the external `ParsedArgv` type from CAC.
 */
interface ParsedOptions {
  args: ReadonlyArray<string>;
  options: {
    [key: string]: string;
  };
}

/**
 * CliBuilder sets up and parses the command-line interface for the `update-agent-status` tool.
 *
 * Usage example:
 *   import { CliBuilder } from './cli';
 *   const { args, options } = new CliBuilder().build();
 *   // options.instanceId, options.instanceAlias, options.routableName, etc.
 *
 * Supported flags:
 *   --instance-alias <alias>         Alias of the Amazon Connect instance to update
 *   --instance-id <id>               ID of the Amazon Connect instance to update
 *
 *   --routable-name <name>           New name for the "Routable" status
 *   --routable-description <desc>    New description for the "Routable" status
 *   --offline-name <name>            New name for the "Offline" status
 *   --offline-description <desc>     New description for the "Offline" status
 *
 *   --region <region>                Override AWS region
 *   --profile <profile>              AWS CLI profile to use
 *
 * After parsing, `build()` returns a `ParsedOptions` object:
 *   - args:     Array of positional arguments (none currently used)
 *   - options:  Key/value map of all recognized flags
 */
export class CliBuilder {
  /**
   * Parses the command line arguments and returns the options.
   * We cast to ParsedOptions to avoid exposing CAC's `ParsedArgv` type.
   * @returns ParsedOptions - The parsed options from the CLI.
   */
  build(): ParsedOptions {
    const cli = cac('update-agent-status');
    cli.option('--instance-alias <amazon-connect-alias>', 'Update target Amazon Connect instance alias');
    cli.option('--instance-id <amazon-connect-id>', 'Update target Amazon Connect instance id');

    cli.option('--routable-name <name>', 'Update the name of the Routable status');
    cli.option('--routable-description <description>', 'Update the description of the Routable status');
    cli.option('--offline-name <name>', 'Update the name of the Offline status');
    cli.option('--offline-description <description>', 'Update the description of the Offline status');

    cli.option('--region <region>', 'AWS region');
    cli.option('--profile <name>', 'AWS CLI profile');

    cli.help();

    return cli.parse(process.argv) as unknown as ParsedOptions;
  }
}
