import { expect } from 'chai';
import { AsyncGraph, AsyncGraphResolver } from '../src';

describe('async-gragh', () => {
  it('should execute "do" immidiatly if "when" is omitted', () => {
    expect(false).to.be.true;
  });
});

/*
const getAppDef = _slug =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve({ appDefId: 'app-def-id-chat', plans: ['Bronze', 'Silver'] });
    }, 1000),
  );

const getSitePremiums = _msid =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve([
        { appDefId: 'app-def-id-forms', productId: 'prd12', cycle: 'Yearly' },
        { appDefId: 'app-def-id-chat', productId: 'prd4', cycle: 'Monthly' },
      ]);
    }, 1000),
  );

const getAppAvailablePlans = _appDefId =>
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
  );

const getProductPrices = (_skus, _geo, _currency) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve([
        { sku: 'aaa', monthlyPrice: 20 },
        { sku: 'bbb', monthlyPrice: 22 },
        { sku: 'ccc', monthlyPrice: 10 },
        { sku: 'ddd', monthlyPrice: 12 },
      ]);
    }, 1000),
  );

const getAppInstanceId: (_appDefId: string, _msid: string) => any = (
  _appDefId,
  _msid,
) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve({ instanceId: '123' });
    }, 1000),
  );

///////////////////////////////////////////////////////////////////////////////////////////

const slug = 'chat-slug';
const msid = '111';
const geo = 'ISR';
const currency = 'USD';

const appDefPromise = getAppDef(slug);

const ppData: AsyncGraph = {
  currentSitePlans: {
    do: () => getSitePremiums(msid),
  },
  appAvailablePlans: {
    do: async res => {
      const prices = (await getProductPrices(
        res.plans.map(plan => plan.sku),
        geo,
        currency,
      )) as [{ sku: string; monthlyPrice: number }];
      return res.plans.map(plan => ({
        ...plan,
        monthlyPrice: (prices.find(price => price.sku === plan.sku) as {
          sku: string;
          monthlyPrice: number;
        }).monthlyPrice,
      }));
    },
    when: {
      plans: {
        do: res => getAppAvailablePlans(res.appDefId),
        when: appDefPromise,
      },
    },
  },
  appInstanceId: {
    do: async res => (await getAppInstanceId(res.appDefId, msid)).instanceId,
    when: appDefPromise,
  },
};

const testResolveAsyncTree = async () => {
  const result = await AsyncGraphResolver.resolve(ppData);
  console.log('ppData ===========================>', JSON.stringify(result));
};

void testResolveAsyncTree();
*/
