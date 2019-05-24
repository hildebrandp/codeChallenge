const test = require('ava');
const sinon = require('sinon');
const script = require('./app');
const logSpy = sinon.spy(console, 'log');
test('Test user graph imput, user inputs string', t => {
    script.testInput('node_0', 'node_9', 0);
    t.is(logSpy.getCall[0].args[0], '');
});
//# sourceMappingURL=app_unittest.js.map