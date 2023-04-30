import React, { ReactNode, RefObject, Component } from 'react';

type Prop = {
    [x: string]: any;
}

type WcComponentProps = Prop & {
    tag: string;
    children: ReactNode;
}

class WcComponent extends Component<WcComponentProps> {
    constructor(props: any) {
        super(props);

        this.listeners = new Map(Object.keys(props).filter(it => it.startsWith('on')).map(key => ([key, props[key]])));
        this.elementRef = React.createRef();
    }

    protected listeners: Map<string, EventListenerOrEventListenerObject>;
    protected elementRef: RefObject<HTMLElement>;
    protected listenersAttached: boolean = false;

    addEventListeners() {
        if (!this.listenersAttached && this.elementRef.current !== null) {
            this.listeners.forEach((callback, key) => {
                this.elementRef.current?.addEventListener(key, callback);
            })

            this.listenersAttached = true;
        }
    }

    removeEventListeners() {
        if (this.listenersAttached && this.elementRef.current !== null) {
            this.listeners.forEach((callback, key) => {
                this.elementRef.current?.removeEventListener(key, callback);
            })

            this.listenersAttached = false;
        }
    }

    componentDidMount(): void {
        this.addEventListeners();
    }

    componentWillUnmount(): void {
        this.removeEventListeners();
    }

    render() {
        const { tag, children } = this.props;
        const TagName: any = tag;
        this.addEventListeners();
        return <TagName {...this.props} ref={this.elementRef}>{children}</TagName>;
    }
}


export default WcComponent;