import { mount } from "enzyme";
import { combineReducers, createStore } from "redux";
import messenger from "../reducers/messenger";
import { Provider } from "react-redux";
import Messenger from "../components/Messenger";
import React from "react";
import sinon from "sinon";
import * as api from "../api/messenger";
import { noop } from 'lodash';

export function renderAppWithState(renderMethod = mount) {
  const store = createStore(combineReducers({ messenger }));
  const wrapper = renderMethod(
    <Provider store={store}>
      <div className="App">
        <Messenger/>
      </div>
    </Provider>
  );

  return { store, wrapper };
}

export const stubLoadTextsApi = ({ beforeResolve = noop, afterResolve = noop } = {}) => {
  return sinon.stub(api, 'loadTextsApi').callsFake(leadId => new Promise(resolve => {
    let texts = Array(3).fill({}).map((_, index) => ({
      id: index + 1,
      date: Date.now() + index,
      body: `Message ${index + 1} for ${leadId}`,
      isReply: Math.random() > 0.5,
      isDelivered: true,
    }));

    // reverting to check sort
    texts = texts.sort((a, b) => b.date - a.date);

    beforeResolve(texts, leadId);

    resolve({
      data: texts
    });
    setTimeout(() => afterResolve(texts, leadId));
  }));
};

export const stubLoadLeadInfoApi = ({ beforeResolve = noop, afterResolve = noop } = {}) => {
  return sinon.stub(api, 'loadLeadInfoApi').callsFake(leadId => new Promise((resolve) => {
    beforeResolve();
    resolve({
      data: {
        id: leadId,
        name: `Lead Id${leadId}`,
        phone: 2225557777
      }
    });
    setTimeout(afterResolve);
  }));
};

export const stubSendTextApi = ({ beforeResolve = noop, afterResolve = noop } = {}) => {
  return sinon.stub(api, 'sendTextApi').callsFake((leadId, textToBeSent) => new Promise((resolve) => {
    beforeResolve();
    resolve({
      data: {
        id: Math.random() * 1000,
        date: Date.now(),
        body: textToBeSent.body,
        isReply: false,
        isDelivered: true,
      }
    });
    setTimeout(afterResolve);
  }));
};