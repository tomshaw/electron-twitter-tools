export default class Decorator {
  constructor(component, credentials, callback) {
    component.action(credentials, callback)
  }
}
