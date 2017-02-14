require('babel-register')({
  presets: ['es2015'],
});

const { emitter, history, handleMessages } = require('./../src/emitter');
const describe = require('mocha').describe;
const expect = require('expect');
const emitTool = emitter();

describe('emitter unit tests', () => {
  it('should have an init method', () => {
    expect(emitTool).to.have.ownProperty('init');
  });

  it('should have a subscribe method', () => {
    expect(emitTool).to.have.ownProperty('subscribe');
  });

  it('should have an unsubscribe method', () => {
    expect(emitTool).to.have.ownProperty('unsubscribe');
  });

  it('should have a ssend method', () => {
    expect(emitTool).to.have.ownProperty('send');
  });

  it('should have an error method', () => {
    expect(emitTool).to.have.ownProperty('error');
  });
});