import {Component, h} from 'preact';
import style from './style.css';
import {Pattern, SORTED_PATTERN_NAMES} from "../../utils/simulator";
import classNames from "classnames";

type PatternDropdownProps = {
    value: Pattern;
    onChanged: (pattern: Pattern) => void;
    disabled: boolean;
};

type PatternDropdownState = {
    menuPos: { top: number; left: number };
    isOpen: boolean;
};

class PatternDropdown extends Component<PatternDropdownProps, PatternDropdownState> {

    constructor(props: PatternDropdownProps) {
        super(props);
        this.state = {
            menuPos: { top: 0, left: 0 },
            isOpen: false
        }
    }

    private onButtonClicked = (event: MouseEvent): void => {
        if (event.target instanceof HTMLElement) {
            const buttonRect = event.target.getBoundingClientRect();
            this.setState({
                menuPos: { top: buttonRect.top + buttonRect.height, left: buttonRect.left },
                isOpen: !this.state.isOpen
            })
        }
    };

    private onButtonBlur = (): void => {
        this.setState({ ...this.state, isOpen: false });
    }

    private patternSelectedHandler = (pattern: string): () => void => {
        return (): void => {
            this.setState({ ...this.state, isOpen: false });
            this.props.onChanged((Pattern as never)[pattern]);
        }
    }

    private patternDisplayName(pattern: string): string {
        return pattern.replace(/_/g, ' ');
    }

    render(): JSX.Element {
        return (
          <div>
              <button className={style['button']}
                      disabled={this.props.disabled}
                      tabIndex={0}
                      onBlur={this.onButtonBlur}
                      onClick={this.onButtonClicked}>{this.patternDisplayName(Pattern[this.props.value])}
              </button>
              {this.state.isOpen ? (
              <div className={style['menu-container']}>
                  <div className={style['menu']} style={`top:${this.state.menuPos.top}px;left:${this.state.menuPos.left}px;`}>
                    { SORTED_PATTERN_NAMES.map( patternName => (
                      <div className={classNames(style['menu-item'], { [style['menu-item-selected']]: (Pattern as never)[patternName] === this.props.value })}
                           onMouseDown={this.patternSelectedHandler(patternName)}>{this.patternDisplayName(patternName)}</div>
                    ))}
                  </div>
              </div>) : ''}
          </div>
        );
    }
}

export default PatternDropdown;
