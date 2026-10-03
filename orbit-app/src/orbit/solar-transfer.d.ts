export interface AuraBody {x:number;y:number;radius:number}
export function solarTransferPoint(from:AuraBody,to:AuraBody,index:number,progress:number):{x:number;y:number;p:number;angle:number};
export interface TransferNode {id:string;kind:string;parentId?:string|null}
export function solarTransferRoute(from:TransferNode,to:TransferNode,nodes:TransferNode[]):string[];
