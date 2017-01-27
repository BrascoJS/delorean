import mobx from 'mobx';

export default function getDecorator(func) {
  return (storeOrConfig, config) => {
    if (typeof storeOrConfig === 'object' && !mobx.isObservable(storeOrConfig)) {
    	console.log('1')
      return store => func(store, storeOrConfig);
    }
    console.log('calling func')
    return func(storeOrConfig, config);
  };
}
