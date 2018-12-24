type getAppAvailablePlansResult = Promise<
  {
    appDefId: string;
    plan: string;
    cycle: string;
    sku: string;
    productId: string;
  }[]
>;

export const getAppAvailablePlans = (_appDefId: string) => {
  console.log('getAppAvailablePlans started');
  return new Promise(resolve =>
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
};
