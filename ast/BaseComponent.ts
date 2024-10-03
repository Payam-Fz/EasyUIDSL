import { Visitor } from "../visitor";
import { ASTNode } from "./ASTNode";

export enum ComponentEnum {
    Invalid,
    Button,
    Text,
    Picture,
    Checkbox,
    Container,
    TextInput
}

/**
 * The name of one of our predefined components.
 */
export class BaseComponent extends ASTNode {

    private _htmlTagMap: Record<ComponentEnum, string> = {
        [ComponentEnum.Button] : 'button',
        [ComponentEnum.Picture]: 'img',
        [ComponentEnum.Text] : 'p',
        [ComponentEnum.TextInput]: 'input',
        [ComponentEnum.Checkbox]: 'input',
        [ComponentEnum.Container]: 'div',
        [ComponentEnum.Invalid]: 'div'
    }

    private _component: ComponentEnum;
    constructor(componentSymbol: string) {
        super();
        let component = ComponentEnum.Invalid;
        switch (componentSymbol) {
            case 'BUTTON':
                component = ComponentEnum.Button;
                break;
            case 'TEXT':
                component = ComponentEnum.Text;
                break;
            case 'PICTURE':
                component = ComponentEnum.Picture;
                break;
            case 'CHECKBOX':
                component = ComponentEnum.Checkbox;
                break;
            case 'CONTAINER':
                component = ComponentEnum.Container;
                break;
            case 'TEXTINPUT':
                component = ComponentEnum.TextInput;
                break;
            default:
        }
        this._component = component;
    }

    get component(): ComponentEnum {
        return this._component;
    }

    get htmlTag(): string {
        return this._htmlTagMap[this._component];
    }

    public accept<T, U>(v: Visitor<T, U>, t: T): U {
        return v.visitBaseComponent(this, t);
    }
}
