import npmValidate from 'validate-npm-package-name'

export function validate(name) {
  const { validForNewPackages, warnings } = npmValidate(name)
  if (!validForNewPackages) {
    console.warn(warnings)
  }
  return name
}
