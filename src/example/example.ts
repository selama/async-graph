import {
  _AsyncGraphResolver as AsyncGraphResolver,
  _AsyncGraph as AsyncGraph,
} from '../async-graph';
import { getAppDef } from './getAppDef';
import { getSitePremiums } from './getSitePremiums';
import { getAppAvailablePlans } from './getAppAvailablePlans';
import { mergePlansPrices } from './mergePlansPrices';
import { getAppInstanceId } from './getAppInstanceId';

const slug = 'chat-slug';
const msid = '111';
const geo = 'ISR';

const appDefPromise = getAppDef(slug);

const ppData: AsyncGraph = {
  currentSitePlans: {
    do: () => getSitePremiums(msid),
  },
  appAvailablePlans: {
    when: {
      plans: {
        when: appDefPromise,
        do: ({ appDefId }) => getAppAvailablePlans(appDefId),
      },
    },
    do: ({ plans }) => mergePlansPrices(plans, geo),
  },
  appInstanceId: {
    when: appDefPromise,
    do: async ({ appDefId }) =>
      (await getAppInstanceId(appDefId, msid)).instanceId,
  },
};

export const demoAsyncGraph = async () => {
  const result = await AsyncGraphResolver.resolve(ppData);
  console.log(JSON.stringify(result, null, 2));
};
