import Decorator from '../decorator'

export default class TwitterDecorator extends Decorator {

  constructor(component, args, callback) {
    super(component, args, callback)
    console.dir(component)
  }

}
