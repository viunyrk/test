import React from 'react'
import { Label } from 'semantic-ui-react'
import isNil from 'lodash/isNil'

function ErrorLabel(props = {}) {
  const { className, multiline, pointing, ...labelProps } = props;
  let classNames = 'basic label--error large';
  if (className) {
    classNames += ' ' + className;
  }
  if (multiline) {
    classNames += ' multiline';
  }
  return (
    <Label
      {...labelProps}
      className={classNames}
      pointing={isNil(pointing) ? true : pointing}
    />
  );
}

export default ErrorLabel;
