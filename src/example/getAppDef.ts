type getAppDefResult = Promise<{ appDefId: string; plans: string[] }>;

export const getAppDef = (_slug: string) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve({ appDefId: 'app-def-id-chat', plans: ['Bronze', 'Silver'] });
    }, 1000),
  ) as getAppDefResult;
