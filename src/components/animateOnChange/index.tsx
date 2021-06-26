// Resource: https://github.com/Sobesednik/preact-animate-on-change/blob/master/src/index.jsx

import {Component, createRef, h, JSX} from 'preact'

type Events = {
  start: string[];
  end: string[];
  startRemoved: string[];
  endRemoved: string[];
};

type EventType = keyof Events & string;

const events: Events = {
  start: ['animationstart', 'webkitAnimationStart', 'mozAnimationStart', 'oanimationstart', 'MSAnimationStart'],
  end: ['animationend', 'webkitAnimationEnd', 'mozAnimationEnd', 'oanimationend', 'MSAnimationEnd'],
  startRemoved: [],
  endRemoved: [],
}

type AnimateOnChangeProps = {
  baseClassName: string;
  animationClassName: string;
  animate: boolean;
};

type AnimateOnChangeState = {
  animating: boolean;
  clearAnimationClass: boolean;
};

/**
 * # AnimateOnChange component.
 * Adds `animationClassName` when `animate` is true, then removes
 * `animationClassName` when animation is done (event `animationend` is
 * triggered).
 *
 * @prop {string} baseClassName - Base class name.
 * @prop {string} animationClassName - Class added when `animate == true`.
 * @prop {bool} animate - Whether to animate component.
 */
export class AnimateOnChange extends Component<AnimateOnChangeProps, AnimateOnChangeState> {

  ref = createRef();

  constructor (props: AnimateOnChangeProps) {
    super(props)
    this.state = { animating: false, clearAnimationClass: false }
    this.animationStart = this.animationStart.bind(this)
    this.animationEnd = this.animationEnd.bind(this)
  }

  componentDidMount (): void {
    const elm = this.ref.current;
    this.addEventListener('start', elm, this.animationStart)
    this.addEventListener('end', elm, this.animationEnd)
  }

  componentWillUnmount (): void {
    const elm = this.ref.current
    this.removeEventListeners('start', elm, this.animationStart)
    this.removeEventListeners('end', elm, this.animationEnd)
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  addEventListener (type: EventType, elm: any, eventHandler: (event: Event) => void): void {
    // until an event has been triggered bind them all
    events[type].map(event => {
      // console.log(`adding ${event}`)
      elm.addEventListener(event, eventHandler)
    })
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  removeEventListeners (type: EventType, elm: any, eventHandler: (event: Event) => void): void {
    events[type].map(event => {
      // console.log(`removing ${event}`)
      elm.removeEventListener(event, eventHandler)
    })
  }

  updateEvents (type: EventType, newEvent: string): void {
    // console.log(`updating ${type} event to ${newEvent}`)
    events[type === 'start' ? 'startRemoved' : 'endRemoved'] = events[type].filter(e => e !== newEvent)
    events[type] = [newEvent]
  }

  animationStart (event: Event): void {
    if (events['start'].length > 1) {
      this.updateEvents('start', event.type)
      this.removeEventListeners('startRemoved', this.ref.current, this.animationStart)
    }
    this.setState({ animating: true, clearAnimationClass: false })
  }

  animationEnd (event: Event): void {
    if (events['end'].length > 1) {
      this.updateEvents('end', event.type)
      this.removeEventListeners('endRemoved', this.ref.current, this.animationStart)
    }
    // send separate, animation state change will not render
    this.setState({ clearAnimationClass: true }, () => {
      this.setState({ animating: false, clearAnimationClass: false })
    })
  }



  shouldComponentUpdate (nextProps: Readonly<AnimateOnChangeProps>, nextState: Readonly<AnimateOnChangeState>): boolean {
    if (this.state.animating !== nextState.animating) {
      // do not render on animation change
      return false
    }
    return true
  }

  render (): JSX.Element {
    let { baseClassName: className } = this.props;
    const { animate, animationClassName, children } = this.props;
    const { clearAnimationClass } = this.state;

    if (animate && !clearAnimationClass) {
      className += ` ${animationClassName}`
    }

    return <span ref={this.ref} className={className}>{children}</span>
  }
}