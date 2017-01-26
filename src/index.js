import getDecorator from './getDecorator';
import dlorean from './dev';
import Dlorean from './ui/index';

if (process.env.NODE_ENV === 'development') {
  //module.exports = require('./dev').default; // eslint-disable-line global-require
} else {
 // module.exports = getDecorator(store => store);
}

export const delorean = dlorean(store => store);
export const Delorean = Dlorean;
	