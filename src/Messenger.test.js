import { renderAppWithState, stubLoadLeadInfoApi, stubLoadTextsApi, stubSendTextApi } from './utils/test.helpers';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { leads } from './components/Messenger'
import sinon from 'sinon';
import { Loader } from 'semantic-ui-react';

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  sinon.restore();
});

// 1. On click on a lead in "Leads list" new DialogWindow is opened
// and the request for getting leadInfo has been sent with the correct leadId
it('renders dialog on lead click and calls loadLeadInfoApi with correct parameter', () => {
  stubLoadTextsApi();
  const { wrapper } = renderAppWithState();
  const id = leads[0].leadId;
  const lead = wrapper.find(`[data-test-lead=${id}]`);
  let dialog = wrapper.find(`[data-test-dialog=${id}]`);
  const loadLeadInfoApi = stubLoadLeadInfoApi();

  expect(loadLeadInfoApi.calledOnce).toBe(false);
  expect(dialog.length).toBe(0);
  lead.simulate('click');

  dialog = wrapper.find(`[data-test-dialog=${id}]`);
  // pops dialog
  expect(dialog.length).toBe(1);
  // calls loadLeadInfoApi
  expect(loadLeadInfoApi.calledWith(id)).toBe(true);
});

// 2. After the info about lead has been loaded, the request for getting leads texts history
// has been sent with the correct leadId
// В данном случае DialogWindow(58), запрос texts history 'loadMessages' вызывается
// независимо от info запроса 'loadLeadInfoApi' => test упадет.
it('Calls loadTextsApi with correct leadId after loadLeadInfoApi has been loaded', done => {
  const id = leads[0].leadId;
  let loadLeadInfoApiResolved = false;

  stubLoadLeadInfoApi({
    afterResolve: () => {
      loadLeadInfoApiResolved = true;
    }
  });

  stubLoadTextsApi({
    beforeResolve: (_, leadId) => {
      // check leadInfoApi has been loaded by the time loadTextsApi called
      expect(loadLeadInfoApiResolved).toBe(true);
      expect(leadId).toBe(id);
      done();
    },
  });

  const { wrapper } = renderAppWithState();
  wrapper.find(`[data-test-lead=${id}]`).simulate('click');
});

// 3. Loader has been shown in DialogWindow while texts request is in pending state
it('Shows loader while loadTextsApi request is pending', done => {
  stubLoadLeadInfoApi();
  stubLoadTextsApi({
    beforeResolve: () => {
      wrapper.update();
      const loader = wrapper.find(Loader);
      // loader on request
      expect(loader.length).toBe(1);
      expect(loader.prop('active')).toBe(true);
    },
    afterResolve: () => {
      wrapper.update();
      const loader = wrapper.find(Loader);
      // no loader after request
      expect(loader.length).toBe(1);
      expect(loader.prop('active')).toBe(false);
      done();
    }
  });

  const { wrapper } = renderAppWithState();
  const id = leads[0].leadId;

  // no loader at start
  const loader = wrapper.find(Loader);
  expect(loader.length).toBe(0);

  wrapper.find(`[data-test-lead=${id}]`).simulate('click');
});

// 4. When texts are received, they are rendered in DialogWindow in the correct order
it('Renders texts in DialogWindow in the correct order', done => {
  stubLoadLeadInfoApi();
  stubLoadTextsApi({
    afterResolve: (texts = []) => {
      const assertDates = texts.sort((a, b) => a.date - b.date).map(t => t.date);
      wrapper.update();
      const messageDates = wrapper.find('[data-test-message]').map(node => node.prop('data-test-message'));
      // asserting
      expect(messageDates).toEqual(assertDates);
      done();
    }
  });

  const { wrapper } = renderAppWithState();
  const id = leads[0].leadId;
  wrapper.find(`[data-test-lead=${id}]`).simulate('click');
});

// 5. When a user types something in input of DialogWindow and clicks Enter -
// the message has been added at the end of the list and has loader next to it
it('Adds message at the end of the list and has loader next to it', done => {
  const newMessage = 'new message appended';
  stubLoadLeadInfoApi();
  stubLoadTextsApi({
    afterResolve: () => {
      const dialog = wrapper.find(`[data-test-dialog=${id}]`);
      const input = dialog.find('textarea');
      input.simulate("change", { target: { value: newMessage } });
      input.simulate("keydown", { which: 13, shiftKey: false });
    }
  });
  stubSendTextApi({
    afterResolve: () => {
      wrapper.update();
      const dialog = wrapper.find(`[data-test-dialog=${id}]`);
      const lastMessage = dialog.find('[data-test-message]').last();
      const loader = lastMessage.find(Loader);
      const pre = lastMessage.find('[data-test-message-container]');

      expect(pre.prop('children')).toBe(newMessage);
      expect(loader.length).toBe(1);
      done();
    }
  });

  const { wrapper } = renderAppWithState();
  const id = leads[0].leadId;
  wrapper.find(`[data-test-lead=${id}]`).simulate('click');
});

// 6. On clicking on "-" the dialog is collapsed
it('Collapses dialog on "-" click', () => {
  stubLoadLeadInfoApi();
  stubLoadTextsApi();

  const { wrapper } = renderAppWithState();
  const id = leads[0].leadId;
  wrapper.find(`[data-test-lead=${id}]`).simulate('click');

  let dialog = wrapper.find(`[data-test-dialog=${id}]`);
  const collapse = dialog.find('[data-test-collapse]');
  let messageContainer = dialog.find('[data-test-message-container]');
  let input = dialog.find('[data-test-input-container]');

  expect(messageContainer.length).toBe(1);
  expect(input.length).toBe(1);

  collapse.simulate('click');
  wrapper.update();

  dialog = wrapper.find(`[data-test-dialog=${id}]`);
  messageContainer = dialog.find('[data-test-message-container]');
  input = dialog.find('[data-test-input-container]');

  expect(messageContainer.length).toBe(0);
  expect(input.length).toBe(0);
});

// 7. On clicking on "X" the dialog is closed
it('Closes dialog on "X" click', () => {
  stubLoadLeadInfoApi();
  stubLoadTextsApi();

  const { wrapper } = renderAppWithState();
  const id = leads[0].leadId;
  wrapper.find(`[data-test-lead=${id}]`).simulate('click');

  let dialog = wrapper.find(`[data-test-dialog=${id}]`);
  let close = dialog.find('[data-test-close]');

  expect(dialog.length).toBe(1);
  expect(close.length).toBe(1);

  close.simulate('click');
  wrapper.update();

  dialog = wrapper.find(`[data-test-dialog=${id}]`);
  expect(dialog.length).toBe(0);
});

// 8. On clicking on one more lead the second dialog is opened
it('Opens another dialog on another lead click', () => {
  stubLoadLeadInfoApi();
  stubLoadTextsApi();

  const { wrapper } = renderAppWithState();
  const id = leads[0].leadId;
  const id2 = leads[1].leadId;

  wrapper.find(`[data-test-lead=${id}]`).simulate('click');
  const dialog = wrapper.find(`[data-test-dialog=${id}]`);
  expect(dialog.length).toBe(1);

  wrapper.find(`[data-test-lead=${id2}]`).simulate('click');
  const dialog2 = wrapper.find(`[data-test-dialog=${id2}]`);
  expect(dialog2.length).toBe(1);
});