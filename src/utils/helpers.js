export const makeInitials = (fullName) => {
  if (!fullName) {
    return '';
  }

  const initials = fullName.split(' ').map(name => name.charAt(0)).join('');
  return initials.charAt(0) + initials.charAt(initials.length - 1);
};
