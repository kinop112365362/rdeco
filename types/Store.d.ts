export class Store {
    /**
     * @param rawStoreConfig { import("./types").StoreConfig }   用于创建 Store 的配置对象
     */
    constructor(rawStoreConfig: import("./types").StoreConfig);
    state: any;
    refs: any;
    ref: any;
    styles: any;
    style: any;
    context: {};
    /** props 到底是否有其实际价值? 暂时不放在任何 context 中看看情况 */
    props: {};
    /** create this.rc
     * rc 只支持对 2 级 Key 做 State 快捷操作,
     * 从设计角度讲, 2 层 state 结构足够满足大多数复杂的场景,
     * 因此不提供嵌套 set, 避免开发者对状态设计产生工具便利性的依赖
     */
    stateKeys: string[];
    rc: {
        setState: (nextState: any) => void;
        setViewCtrl: (nextState: any) => void;
    };
    private: {
        controllerContext: {
            state: any;
            refs: any;
            ref: any;
            styles: any;
            style: any;
            context: {};
            props: {};
        };
        viewContext: {
            state: any;
            refs: any;
            ref: any;
            styles: any;
            style: any;
            context: {};
            props: {};
        };
        serviceContext: {
            state: any;
            refs: any;
            ref: any;
            styles: any;
            style: any;
            context: {};
            props: {};
        };
    };
    view: {};
    controller: {};
    service: {};
    dispatch(): void;
    bindViewContext(fnKeys: any, fnObj: any, hook?: any): {};
    mixinPrivateContext(contextName: any, key: any, value: any): void;
    updateFunctionContextStateAndContextAndProps({ state, context, props }: {
        state: any;
        context: any;
        props: any;
    }): void;
    update(state: any, context: any, dispatch: any, props: any): void;
}
