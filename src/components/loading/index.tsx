import {Component, h} from 'preact';
import style from './style.css';
import classNames from "classnames";

export type LoadingProps = {
  isShown: boolean;
};

type LoadingState = {
};

export class Loading extends Component<LoadingProps, LoadingState> {

  render(): JSX.Element {
    return (
      <div className={classNames(style['loading'], {[style['loading--hide']]: !this.props.isShown})}>
        <div>Conway's</div>
        <div>Game of Life</div>
        <div className={style['loading-spinner']}>
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--1'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--2'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--3'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--4'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--5'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--6'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--7'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--8'])} />
          <div className={classNames(style['loading-spinner-cube'], style['loading-spinner-cube--9'])} />
        </div>
      </div>
    );
  }
}
