import mobx from 'mobx';

export default function getDecorator(func) {
  return (storeOrConfig, config) => {
    if (typeof storeOrConfig === 'object' && !mobx.isObservable(storeOrConfig)) {
      return function(store){ return func(store, storeOrConfig);} ;
    }
    return func(storeOrConfig, config);
  };
}
