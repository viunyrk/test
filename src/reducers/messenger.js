import TYPES from '../utils/actionTypes';
import CONST from '../utils/const'

const initialState = {
  showHiddenDialogsList: false,
  dialogs: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TYPES.INIT_DIALOG: {
      const { leadId, leadName, lastUpdateFrom, isActive = true } = action.data;

      const dialogs = [
        ...state.dialogs.map(dialog => ({ ...dialog, isActive: isActive ? false: dialog.isActive })),
        {
          leadId,
          leadName,
          lastUpdateFrom,
          isActive,
          view: CONST.DIALOG_WINDOW_VIEWS.opened,
          isSetToActiveTimestamp: Date.now(),
        }
      ];

      return {
        ...state,
        dialogs
      };
    }

    case TYPES.REMOVE_DIALOG: {
      const { leadId } = action.data;
      return {
        ...state,
        dialogs: state.dialogs.filter(dialog => dialog.leadId !== leadId),
        leadWithActiveDialogId: null
      };
    }

    case TYPES.UPDATE_DIALOG: {
      const { leadId } = action.data;

      const getUpdatedDialog = (dialog, updates) => {
        const isActive = typeof updates.isActive !== 'undefined' ?
          updates.isActive :
          (!!updates.view && updates.view !== CONST.DIALOG_WINDOW_VIEWS.opened) ? false : dialog.isActive;

        return {
          ...dialog,
          ...updates,
          isSetToActiveTimestamp: isActive ? Date.now() : dialog.isSetToActiveTimestamp,
          isActive,
        };
      };

      const dialogs = state.dialogs.map(dialog => dialog.leadId === leadId
        ? getUpdatedDialog(dialog, action.data)
        : dialog
      );

      return {
        ...state,
        dialogs,
      };
    }

    case TYPES.TOGGLE_HIDDEN_DIALOGS_LIST: {
      return {
        ...state,
        showHiddenDialogsList: typeof action.data === 'undefined' ? !state.showHiddenDialogsList : action.data
      };
    }

    case TYPES.ADD_TEXTS_TO_DIALOG: {
      const { leadId, textsData, extendOriginalTextsList = false } = action.data;
      return {
        ...state,
        dialogs: state.dialogs.map(dialog => {
          if (dialog.leadId !== leadId) {
            return dialog;
          }

          return {
            ...dialog,
            textsData: {
              ...dialog.textsData,
              texts: extendOriginalTextsList ? [...dialog.textsData.texts, ...textsData.texts] : textsData.texts,
            }
          }
        })
      };
    }

    case TYPES.UPDATE_TEXT_IN_DIALOG: {
      const { leadId, textId, updates } = action.data;

      return {
        ...state,
        dialogs: state.dialogs.map(dialog => {
          if (dialog.leadId !== leadId) {
            return dialog;
          }

          return {
            ...dialog,
            textsData: {
              ...dialog.textsData,
              texts: dialog.textsData.texts.map((text) => {
                if (text.id !== textId) {
                  return text;
                }
                return {
                  ...text,
                  ...updates
                }
              }),
            }
          }
        })
      };
    }

    default:
      return state;
  }
}
