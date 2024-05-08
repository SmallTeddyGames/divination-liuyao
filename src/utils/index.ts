/**
 * 获取assets静态资源，路径为assets
 * @param url 图片名称
 * @returns
 */
export const getAssetsFile = (url: string): string => {
    return new URL(`../assets/${url}`, import.meta.url).href
}
