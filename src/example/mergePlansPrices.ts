type getProductPricesResult = Promise<{ sku: string; monthlyPrice: number }[]>;

export const getProductPrices = (_skus: string, _geo: string) =>
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

export const mergePlansPrices = async (plans, geo) => {
  console.log('mergePlansPrices started');
  const prices = await getProductPrices(plans.map(plan => plan.sku), geo);
  return plans.map(plan => ({
    ...plan,
    monthlyPrice: prices.find(price => price.sku === plan.sku).monthlyPrice,
  }));
};
