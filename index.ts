import { INodeType } from 'n8n-workflow';
import { Elecz } from './nodes/Elecz/Elecz.node';

export const nodes: INodeType[] = [new Elecz()];
