type getSitePremiumsResult = Promise<
  { appDefId: string; productId: string; cycle: string }[]
>;

export const getSitePremiums = (_msid: string) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve([
        { appDefId: 'app-def-id-forms', productId: 'prd12', cycle: 'Yearly' },
        { appDefId: 'app-def-id-chat', productId: 'prd4', cycle: 'Monthly' },
      ]);
    }, 1000),
  ) as getSitePremiumsResult;
