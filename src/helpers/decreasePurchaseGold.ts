interface Player {
  gold: number,
  inventory: any,
}
interface Item {
  value: number
}

export const decreasePurchasedGold = (player:Player, item:Item) =>{
    player.gold -= item.value;
  }