import Decorator from '../decorator'

export default class StorageDecorator extends Decorator {

  constructor(component, args, callback) {
    super(component, args, callback)
    console.dir(args)
  }

}
