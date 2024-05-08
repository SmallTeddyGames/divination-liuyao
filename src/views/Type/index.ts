/**
 * 游戏状态
 */
type GameStateType = 'init' | 'start' | 'pause' | 'win' | 'lose'
/**
 * 游戏信息
 */
type GameInfoType = {
    // 游戏状态
    gameState: GameStateType;
    // 是否显示游戏日志
    isShowGameInfo: boolean;
    // 游戏日志(Todo: 数据结构待定)
    gameLogItems: any[];
}

export type {
    GameStateType,
    GameInfoType
}
