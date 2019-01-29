import TYPES from '../utils/actionTypes';

export function initDialogWindow(data) {
  return {
    type: TYPES.INIT_DIALOG,
    data,
  }
}

export function updateDialog(data) {
  return {
    type: TYPES.UPDATE_DIALOG,
    data,
  };
}

export function removeDialogWindow(leadId) {
  return {
    type: TYPES.REMOVE_DIALOG,
    data: {
      leadId,
    }
  }
}

export function toggleHiddenDialogsList(visibility) {
  return {
    type: TYPES.TOGGLE_HIDDEN_DIALOGS_LIST,
    data: visibility
  }
}


export function addTextsToDialog(data) {
  return {
    type: TYPES.ADD_TEXTS_TO_DIALOG,
    data,
  }
}

export function updateTextInDialog(data) {
  return {
    type: TYPES.UPDATE_TEXT_IN_DIALOG,
    data,
  }
}
