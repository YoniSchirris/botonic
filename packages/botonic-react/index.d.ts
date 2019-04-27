import * as React from 'react';
import * as core from '@botonic/core';

export interface MessageProps{
  type? : string;
  from? : string;
  delay? : number;
  typing? : number;
  children : any;
  json: any;
  style: any;

}
export class Message extends React.Component<MessageProps, any> {}


//TODO inherit from MessageProps?
export interface TextProps{
  delay?: number;
}
export class Text extends React.Component<TextProps, any> {}

export interface ButtonProps{
  payload?: string;
  url?: string;
}
export class Button extends React.Component<ButtonProps, any> {}

export interface PicProps{
  src: string;
}
export class Pic extends React.Component<PicProps, any> {}

export class Carousel extends React.Component<any, any> {}
export class Title extends React.Component<any, any> {}
export class Subtitle extends React.Component<any, any> {}
export class Element extends React.Component<any, any> {}

export class App {
  constructor(app: {
    routes: core.Route[],
    locales: any,
    integrations?: any,
    theme?: any,
    plugins?: any,
    appId?: any,
    defaultTyping?: any,
    defaultDelay?: any
  });
}

export interface Input {
  payload: string;
  type: string; // text, ...
}

// Parameters of the actions' botonicInit method
export interface ActionInitInput {
  input : Input;
  session: any;
  params: any;
  lastRoutePath: any;
  plugins: any;
}

export class BotonicInputTester {
  constructor(app: App);

  text(inp: string, session?: any, lastRoutePath?: string): Promise<string>;

  payload(inp: string, session?: any, lastRoutePath?: string): Promise<string>;
}

export class BotonicOutputTester {
  constructor(app: any);

  text(out: string, replies?: any): Promise<string>;
}

export const RequestContext: React.Context<any>;
