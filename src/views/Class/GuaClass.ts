type YaoType = '6' | '8' | '7' | '9';

class BaseGuaClass {
  name = '' // 卦
  layout = '' // 卦布局

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

const AllGua = {
  '999999': new BaseGuaClass({
    name: '乾卦',
    layout: '下乾上乾'
  }),
  '666666': new BaseGuaClass({
    name: '坤卦',
    layout: '下坤上坤'
  }),
  '669696': new BaseGuaClass({
    name: '屯卦',
    layout: '下震上坎'
  }),
  '999966': new BaseGuaClass({
    name: '蒙卦',
    layout: '下坎上艮'
  }),
}


export {
  AllGua
}
