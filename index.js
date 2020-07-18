const wrap = document.querySelector('.wrap');
const sky = document.querySelector('.wrap .sky');
const land = document.querySelector('.wrap .land');
const bird = document.querySelector('.wrap .bird');
const span = document.querySelector('span');
const over = document.querySelector('.over');
const gHeight = 600; //游戏面板高度
const gWidth = 800;
let styLeft = 0; //天空左边的距离
let landLeft = 0; //大地左边的距离
let isPlay = false; //游戏舒服开始
let timer = null; //天空和大地计时器
let wingTimer = null; //小鸟翅膀煽动计时器
let pipeTimer = null; //创造柱子计时器
let wingIndex = 1;
let birdTop = 150;
let speed = 2; //初速度
let a = 0; //加速度
let pipeArr = []; //柱子数组
let count = 0;
let resTop = 0; //小鸟离顶部的距离

//游戏开始！
function play() {
  getTimer(30, () => {
    //GAME OVER！
    isRunInfo();
    //处理天空移动 大地移动
    if (styLeft === -800) {
      styLeft = 0;
    }
    if (landLeft === -800) {
      landLeft = 0;
    }
    styLeft = styLeft - 2;
    sky.style.left = styLeft + 'px';
    land.style.left = landLeft-- + 'px';

    //模拟重力
    speed += a;
    a++;
    resTop = birdTop + speed;
    if (resTop < 0) {
      resTop = 0;
      speed = -150;
    }
    if (resTop > 476) {
      resTop = 476;
      a = 0;
      gameOver();
    }
    bird.style.top = resTop + 'px';
    pipeMove();
  }).start();
  wingStart();
  getPipe();
}
/**
 * 判断是否碰撞
 */
function isRunInfo() {
  for (let i = 0; i < pipeArr.length; i++) {
    // console.log(pipeArr[i]);
    //柱子的x中心与小鸟的x中心的绝对值小于两个宽度的一半 ！
    //柱子的y中心与小鸟的y中心的绝对值小于两个高度的一半 ！
    let pipeXCenter = pipeArr[i].left + 26;
    let pipeYCenter = pipeArr[i].top + (pipeArr[i].height) / 2;
    if (Math.abs(pipeXCenter - 218) < 44 && Math.abs(pipeYCenter - (resTop + 12)) < Math.floor((pipeArr[i].height + 24) / 2)) {
      gameOver();
    }
  }
}
//游戏结束
function gameOver() {
  over.style.display = 'block';
  getTimer().stop();
}

//柱子移动
function pipeMove() {
  for (let i = 0; i < pipeArr.length; i++) {
    let res = pipeArr[i].left - 3;
    if (res < -52) {
      pipeArr[i].dom.remove();
      pipeArr.splice(i, 1);
      i--;
      span.innerHTML = count++;
    } else {
      pipeArr[i].left = res;
      pipeArr[i].dom.style.left = res + 'px';
    }
  }
}
/**
 * 生成随机数
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/**
 * 每隔一段时间生成一个柱子
 */
function getPipe() {
  pipeTimer = setInterval(() => {
    createPipe();
  }, 2000)
}
/**
 * 生成柱子
 */
function createPipe() {
  const minHeight = 100;
  const gap = 150;
  const maxHeight = 250;
  let h1 = getRandom(minHeight, maxHeight);
  let h2 = gHeight - h1 - gap - 100;

  let pipe1 = document.createElement('div');
  pipe1.className = 'pipeUp';
  pipe1.style.height = h1 + 'px';
  wrap.appendChild(pipe1);
  pipeArr.push({
    dom: pipe1,
    width: 52,
    height: h1,
    top: 0,
    left: 800,
  })

  let pipe2 = document.createElement('div');
  pipe2.className = 'pipeDown';
  pipe2.style.height = h2 + 'px';
  wrap.appendChild(pipe2);
  pipeArr.push({
    dom: pipe2,
    width: 52,
    height: h2,
    top: gHeight - h2 - 100,
    left: 800,
  })
}

/**
 * 煽动翅膀
 */
function wingStart() {
  wingTimer = setInterval(() => {
    wingIndex = (wingIndex + 1) % 4;
    if (wingIndex === 1) {
      bird.style.backgroundPosition = -7 + 'px';
    }
    if (wingIndex === 2) {
      bird.style.backgroundPosition = -59 + 'px';
    }
    if (wingIndex === 3) {
      bird.style.backgroundPosition = -112 + 'px';
    }
  }, 130)
}

/**
 * 获取一个计时器
 * @param {*} dur 间隔时间 
 * @param {*} doing 每次计时做什么
 * @param {*} end 结束后做什么
 */
function getTimer(dur, doing, end) {
  return {
    start() {
      timer = setInterval(() => {
        doing && doing();
      }, dur)
    },
    stop() {
      clearInterval(timer);
      clearInterval(wingTimer);
      clearInterval(pipeTimer);
      timer = null;
      end && end();
    }
  }
}

/**
 * 监听事件
 */
function handerEvent() {
  document.documentElement.onclick = () => {
    if (isPlay) {
      if (pipeArr.length === 8) {
        createPipe(); //慎用暂停
      }
      getTimer().stop();
      isPlay = false;
    } else {
      play();
      isPlay = true;
    }
  }
  document.documentElement.onkeydown = (e) => {
    //让小鸟往上跳
    if (e.code === 'Space') {
      a = -12;
    }
    //刷新，重来
    if (e.code === 'Enter') {
      location.reload();
    }
  }
}
handerEvent();