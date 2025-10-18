export type CardSize = '1x1' | '2x1' | '3x1' | '4x1';

export interface CardConfig {
	id: string;
	visible: boolean;
	size: CardSize;
	order: number;
}
