export const genSetupPromise = () => {
  let resolve!: (value?: any) => void;
  let reject!: (reason?: any) => void;
  let stateRef: {
    value: 'rejected' | 'resolved' | 'pending'
   } = {
    value: 'pending',
   };
  const promise = new Promise<void>((r, j) => {
    resolve = (...args) => {
      if (stateRef.value === 'pending') {
        stateRef.value = 'resolved';
        r(...args)
      }
    };

    reject = (...args) => {
      if (stateRef.value === 'pending') {
        stateRef.value = 'rejected';
        j(...args);
      }
    };
  });

  return {
    promise,
    reject,
    resolve,
    stateRef,
  }
}
