type YaoType = '6' | '8' | '7' | '9';
type CoinType = 2 | 3

class CoinClass {
  firstCoin: CoinType = 2 // 第一个硬币
  secondCoin: CoinType = 2 // 第二个硬币
  thirdCoin: CoinType = 2 // 第三个硬币

  getYao() {
    return String(this.firstCoin + this.secondCoin + this.thirdCoin);
  }

  constructor(data: Partial<CoinClass> = {}) {
    Object.assign(this, data);
  }
}

class BaseGuaClass {
  firstYao = '' // 第一个爻
  secondYao = '' // 第二个爻
  thirdYao = '' // 第三个爻
  fourYao = '' // 第四个爻
  fiveYao = '' // 第五个爻
  sixYao = '' // 第六个爻
  name = '' // 卦
  layout = '' // 卦布局

  geyBaseGua() {
    this.name = `${this.firstYao}${this.secondYao}${this.thirdYao}${this.fourYao}${this.fiveYao}${this.sixYao}`;
    return this.name;
  }

  getBianGua() {
    return this.name.split('').reduce((bianGua = '', yao: YaoType) => {
      switch(yao) {
        case '6': bianGua += 9; break;
        case '9': bianGua += 6; break;
        default: bianGua += yao;
      }
      return bianGua;
    }, '');
  }

  getCuoGua() {
    return this.name.split('').reduce((cuoGua = '', yao: YaoType) => {
      switch(yao) {
        case '6': cuoGua += 9; break;
        case '7': cuoGua += 8; break;
        case '8': cuoGua += 7; break;
        case '9': cuoGua += 6; break;
      }
      return cuoGua;
    }, '');
  }

  getZongGua() {
    return this.name.split('').reverse().join('');
  }

  getHuGua() {
    return this.name.slice(1, 4) + this.name.slice(2, 5);
  }

  constructor(data: Partial<BaseGuaClass> = {}) {
    Object.assign(this, data);
  }
}

export {
  CoinClass,
  BaseGuaClass
}
