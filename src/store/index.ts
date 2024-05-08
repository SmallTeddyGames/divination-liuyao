import { GameInfoType } from '@/views/Type'

export const useGlobalState: () => Ref<GameInfoType> = createGlobalState(
    () => useStorage('global-state', {
        // 游戏状态
        gameState: 'init',
        // 是否显示游戏日志
        isShowGameInfo: true,
        // 游戏日志
        gameLogItems: []
    })
)
