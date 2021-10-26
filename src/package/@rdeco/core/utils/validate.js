import npmValidate from 'validate-npm-package-name'

export function validate(name) {
  const { validForNewPackages, warnings } = npmValidate(name)
  if (!validForNewPackages) {
    throw new Error(warnings)
  }
  return name
}
