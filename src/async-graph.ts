export interface AsyncNode {
  do(whenResult?: any): Promise<any>;
  when?: Promise<any> | AsyncTree;
}

export interface AsyncTree {
  [key: string]: AsyncNode;
}

const isPromise = (when: Promise<any> | AsyncTree): when is Promise<any> =>
  !!(when as Promise<any>).then;

export class AsyncTreeResolver {
  static resolve = async (asyncTree: AsyncTree) => {
    const keys: string[] = Object.keys(asyncTree);
    const nodes: AsyncNode[] = keys.map(key => asyncTree[key]);
    const results = await Promise.all(
      nodes.map((node: AsyncNode) => AsyncTreeResolver.resolveSingleNode(node)),
    );

    return keys.reduce((accumulator, key, i) => {
      return { ...accumulator, ...{ [key]: results[i] } };
    }, {});
  };

  private static readonly resolveSingleNode = (asyncNode: AsyncNode) => {
    if (asyncNode.when) {
      if (isPromise(asyncNode.when)) {
        // asyncNode.when is a Promise
        return (asyncNode.when as Promise<any>).then(result =>
          asyncNode.do(result),
        );
      }
      // asyncNode.when is an AsyncTree
      return AsyncTreeResolver.resolve(asyncNode.when as AsyncTree).then(
        result => asyncNode.do(result),
      );
    }
    // asyncNode.when is omited
    return asyncNode.do();
  };
}

////////////////////////////////////////////////////////////////////////////////////////////

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

const ppData: AsyncTree = {
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

export const testResolveAsyncTree = async () => {
  const result = await AsyncTreeResolver.resolve(ppData);
  console.log('ppData ===========================>', JSON.stringify(result));
};
