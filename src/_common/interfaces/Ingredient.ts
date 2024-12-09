export interface Ingredient {
	_id: string,
	name: string,
	description: string,
	image: string,
	type: string,
	value: number,
	min_lvl: number,
	effects: string[]
}