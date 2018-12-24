type getAppInstanceIdResult = Promise<{ instanceId: string }>;

export const getAppInstanceId = (_appDefId: string, _msid: string) => {
  console.log('getAppInstanceId started');
  return new Promise(resolve =>
    setTimeout(() => {
      resolve({ instanceId: '123' });
    }, 1000),
  ) as getAppInstanceIdResult;
};
