import {
  _AsyncGraphResolver as AsyncGraphResolver,
  _AsyncGraph as AsyncGraph,
} from '../async-graph';

type getAppDefResult = Promise<{ appDefId: string; plans: string[] }>;

const getAppDef = (_slug: string) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve({ appDefId: 'app-def-id-chat', plans: ['Bronze', 'Silver'] });
    }, 1000),
  ) as getAppDefResult;

type getSitePremiumsResult = Promise<
  { appDefId: string; productId: string; cycle: string }[]
>;

const getSitePremiums = (_msid: string) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve([
        { appDefId: 'app-def-id-forms', productId: 'prd12', cycle: 'Yearly' },
        { appDefId: 'app-def-id-chat', productId: 'prd4', cycle: 'Monthly' },
      ]);
    }, 1000),
  ) as getSitePremiumsResult;

type getAppAvailablePlansResult = Promise<
  {
    appDefId: string;
    plan: string;
    cycle: string;
    sku: string;
    productId: string;
  }[]
>;

const getAppAvailablePlans = (_appDefId: string) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve([
        {
          appDefId: 'app-def-id-chat',
          plan: 'Silver',
          cycle: 'Yearly',
          sku: 'aaa',
          productId: 'prd1',
        },
        {
          appDefId: 'app-def-id-chat',
          plan: 'Silver',
          cycle: 'Monthly',
          sku: 'bbb',
          productId: 'prd2',
        },
        {
          appDefId: 'app-def-id-chat',
          plan: 'Bronze',
          cycle: 'Yearly',
          sku: 'ccc',
          productId: 'prd3',
        },
        {
          appDefId: 'app-def-id-chat',
          plan: 'Bronze',
          cycle: 'Monthly',
          sku: 'ddd',
          productId: 'prd4',
        },
      ]);
    }, 1000),
  ) as getAppAvailablePlansResult;

type getProductPricesResult = Promise<{ sku: string; monthlyPrice: number }[]>;

const getProductPrices = (_skus: string, _geo: string) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve([
        { sku: 'aaa', monthlyPrice: 20 },
        { sku: 'bbb', monthlyPrice: 22 },
        { sku: 'ccc', monthlyPrice: 10 },
        { sku: 'ddd', monthlyPrice: 12 },
      ]);
    }, 1000),
  ) as getProductPricesResult;

type getAppInstanceIdResult = Promise<{ instanceId: string }>;

const getAppInstanceId = (_appDefId: string, _msid: string) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve({ instanceId: '123' });
    }, 1000),
  ) as getAppInstanceIdResult;

///////////////////////////////////////////////////////////////////////////////////////////

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
    do: async ({ plans }) => {
      const prices = await getProductPrices(plans.map(plan => plan.sku), geo);
      return plans.map(plan => ({
        ...plan,
        monthlyPrice: prices.find(price => price.sku === plan.sku).monthlyPrice,
      }));
    },
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
