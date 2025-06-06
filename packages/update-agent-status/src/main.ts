import { CliBuilder } from './cli';
import { UpdateAgentStatus } from './update-agent-status';
import { UpdateAgentStatusParameterBuilder } from './update-agent-status-parameter-builder';

(async () => {
  const parsed = new CliBuilder().build();

  const builder = new UpdateAgentStatusParameterBuilder(parsed.options);
  const parameter = await builder.build();

  const updateStatus = new UpdateAgentStatus(parameter);
  await updateStatus.update();
})();
