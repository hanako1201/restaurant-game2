// ==========================================
// 打工人之魂：社畜服務生模擬器
// Staff Panic Simulator - Core Game Engine
// ==========================================

const FOOD_MENU = {
  mains: [
    { id: 'm1', name: '炙燒黑椒牛排', emoji: '🥩', price: 380 },
    { id: 'm2', name: '經典松露漢堡', emoji: '🍔', price: 260 },
    { id: 'm3', name: '櫻花蝦海鮮炒飯', emoji: '🍤', price: 220 },
    { id: 'm4', name: '秘製濃厚豚骨拉麵', emoji: '🍜', price: 240 }
  ],
  drinks: [
    { id: 'd1', name: '珍珠厚奶茶', emoji: '🧋', price: 80 },
    { id: 'd2', name: '冰滴美式黑咖啡', emoji: '☕', price: 90 },
    { id: 'd3', name: '鮮檸凍頂烏龍', emoji: '🍋', price: 70 },
    { id: 'd4', name: '草莓氣泡特調', emoji: '🍓', price: 110 }
  ],
  desserts: [
    { id: 's1', name: '手工焦糖布丁', emoji: '🍮', price: 90 },
    { id: 's2', name: '法式千層蛋糕', emoji: '🍰', price: 150 },
    { id: 's3', name: '宇治抹茶芭菲', emoji: '🍵', price: 160 },
    { id: 's4', name: '雙球香草冰淇淋', emoji: '🍨', price: 80 }
  ]
};

const ALL_FOODS = [
  ...FOOD_MENU.mains,
  ...FOOD_MENU.drinks,
  ...FOOD_MENU.desserts
];

function getFoodById(id) {
  return ALL_FOODS.find(f => f.id === id);
}

// 8 Distinct Customer Archetypes
const CUSTOMER_TYPES = {
  KIND: {
    type: 'KIND',
    name: '善良天使客',
    class: 'type-kind',
    names: ['溫和的大學生', '氣質小姐姐', '慈祥李奶奶', '滿面笑容大叔'],
    avatars: ['😇', '👩‍🦰', '👵', '🧑‍🎓'],
    patience: 50,
    tipRate: 0.25,
    tag: '天使客人'
  },
  AGGRESSIVE: {
    type: 'AGGRESSIVE',
    name: '狂暴奧客',
    class: 'type-aggressive',
    names: ['急躁挑剔經理', '拍桌大吼阿姨', '自命不凡男客', '暴躁西裝男'],
    avatars: ['🦁', '🤬', '👔', '😡'],
    patience: 22,
    tipRate: 0.05,
    tag: '咄咄逼人'
  },
  SCAM: {
    type: 'SCAM',
    name: '霸王餐慣犯',
    class: 'type-scam',
    names: ['賊頭賊腦男子', '墨鏡行色怪客', '摸肚子大叔', '眼神飄忽小弟'],
    avatars: ['🕶️', '🦹', '🏃', '🕵️'],
    patience: 32,
    tipRate: 0.0,
    tag: '行跡可疑'
  },
  INFLUENCER: {
    type: 'INFLUENCER',
    name: '百萬美食網紅',
    class: 'type-influencer',
    names: ['探店美少女', '百萬吃播主', 'IG打卡達人', '短影音創作者'],
    avatars: ['📱', '📸', '🤳', '✨'],
    patience: 26,
    tipRate: 0.35,
    tag: '相機先吃'
  },
  KID: {
    type: 'KID',
    name: '熊孩子與家長',
    class: 'type-kid',
    names: ['吵鬧母子檔', '摔餐具小霸王', '大聲喧嘩家庭客'],
    avatars: ['🧒', '🍼', '👶', '👪'],
    patience: 25,
    tipRate: 0.15,
    tag: '家庭熊孩'
  },
  RUSH: {
    type: 'RUSH',
    name: '趕車急躁客',
    class: 'type-rush',
    names: ['趕高鐵上班族', '快遞搶單小哥', '壓線打卡大學生'],
    avatars: ['⚡', '🏃', '🎒', '💼'],
    patience: 16, // very fast
    tipRate: 0.5, // double tips if served fast
    tag: '分秒必爭'
  },
  AUNTIE: {
    type: 'AUNTIE',
    name: '熱情話嘮阿姨',
    class: 'type-auntie',
    names: ['熱情王阿姨', '話匣子張大媽', '鄰家熱心阿姨'],
    avatars: ['👵', '🧕', '🍬', '🥰'],
    patience: 45,
    tipRate: 0.3,
    tag: '熱情健談'
  },
  CRITIC: {
    type: 'CRITIC',
    name: '神秘米其林評審',
    class: 'type-critic',
    names: ['米其林秘密客', '美食專欄特約評委', '舌尖稽核員'],
    avatars: ['🧐', '🎩', '🍸', '🔍'],
    patience: 28,
    tipRate: 0.6,
    tag: '米其林密探'
  }
};

// Rich Dialogue Scenarios
const DIALOGUE_EVENTS = [
  {
    type: 'AGGRESSIVE',
    speech: "「喂！服務生！我都等好幾分鐘了，你們廚房是在現抓牛嗎？！到底好了沒？！叫你們店長出來！」",
    options: [
      {
        text: "「非常抱歉耽誤您的寶貴時間！主廚剛才特別為您精修肉質，我現在立刻幫您催促並奉上招待小點！」",
        correct: true,
        feedback: "客人臉色稍緩：「哼，算你態度還行，快點上！」",
        patienceBonus: 15
      },
      {
        text: "「先生您急什麼，菜單上本來就寫現點現做，隔壁桌比你早來都沒叫呢。」",
        correct: false,
        fine: 300,
        feedback: "客人瞬間暴怒拍桌：「什麼服務態度？！我要投訴投死你！」扣薪 $300！"
      },
      {
        text: "「……（裝作沒聽到，低頭快步走開）」",
        correct: false,
        fine: 200,
        feedback: "客人咆哮：「你竟然無視我？！叫主管出來！」扣薪 $200！"
      }
    ]
  },
  {
    type: 'AGGRESSIVE',
    speech: "「這杯水怎麼不是溫的？我剛剛不是特別強調要 42.5 度的溫開水嗎？！你們有沒有在聽客人說話？！」",
    options: [
      {
        text: "「非常對不起！是我疏忽了，我這就立刻替您更換精準溫熱的開水，請您稍候！」",
        correct: true,
        feedback: "客人輕咳一聲：「嗯，下次注意點。」危機解除！",
        patienceBonus: 12
      },
      {
        text: "「餐廳哪來的溫度計測 42.5 度啊，熱水冷水自己兌一下不就好了？」",
        correct: false,
        fine: 300,
        feedback: "客人當場怒摔紙巾：「毫無專業素質！」扣薪 $300！"
      },
      {
        text: "「愛喝不喝，不喝拉倒。」",
        correct: false,
        fine: 450,
        feedback: "觸發超級大客訴！店長親自過來臭罵你一頓！扣薪 $450！"
      }
    ]
  },
  {
    type: 'KID',
    speech: "「（框啷一聲！）熊孩子手一揮把桌上的水杯跟叉子全摔在地上，家長皺眉喊道：『你們地板怎麼這麼滑？！害我小孩嚇到了！』」",
    options: [
      {
        text: "「小朋友沒嚇著吧？別怕別怕，哥哥姐姐拿可愛貼紙跟小餅乾送你，我馬上幫您換一套全新的餐具擦乾地板！」",
        correct: true,
        feedback: "熊孩子拿到貼紙安靜下來，家長露出微笑：「謝謝你呀，這服務真貼心！」小費加成！",
        patienceBonus: 16
      },
      {
        text: "「這位家長，您小孩在店裡跑來跑去摔壞東西，我們是要照價索賠的。」",
        correct: false,
        fine: 300,
        feedback: "家長氣炸護短：「小孩才幾歲你跟他計較？我要在 Google 給你們一顆星差評！」扣薪 $300！"
      },
      {
        text: "「誰家小孩這麼沒家教啊，管好自己的小孩好嗎？」",
        correct: false,
        fine: 400,
        feedback: "家長當場大哭大鬧拍桌：「服務生公然霸凌幼童！」店長震怒扣薪 $400！"
      }
    ]
  },
  {
    type: 'INFLUENCER',
    speech: "「（拿著自拍棒對著手機）等一下！這道菜擺盤完全不對稱，醬汁還噴到盤子邊緣，這要我怎麼拍美照發 IG 推薦啊？！你們懂不懂視覺美學？！」",
    options: [
      {
        text: "「非常感謝您的專業提醒！您這桌的美照肯定極具影響力，主廚立刻為您擦亮盤緣並點綴香草微葉，讓畫面更吸睛！」",
        correct: true,
        feedback: "網紅滿意地對著鏡頭：「這家店服務生很懂生活品味喔，立刻幫他們宣傳！」",
        patienceBonus: 18,
        viralBonus: true
      },
      {
        text: "「食物是用來吃的，不是拿來拍照發限時動態的，冷掉不好吃別怪我們。」",
        correct: false,
        fine: 350,
        feedback: "網紅當場直播發起反向公審：「避雷！這家服務生態度超雷！」扣薪 $350！"
      },
      {
        text: "「那不然你自己進廚房擺啊？」",
        correct: false,
        fine: 500,
        feedback: "爆發百萬粉絲炎上危機！店長差點氣暈過去！扣薪 $500！"
      }
    ]
  }
];

class GameEngine {
  constructor() {
    this.shiftDay = 1;
    this.shiftDuration = 90;
    this.remainingTime = 90;
    this.isPaused = false;
    this.timerInterval = null;

    // Mobile Navigation State ('hall' | 'kitchen')
    this.currentMobileTab = 'hall';

    // Viral influencer bonus active?
    this.viralFameBoost = 1.0;

    // Economics
    this.baseWage = 1500;
    this.tipsEarned = 0;
    this.finesTotal = 0;
    this.walletSavings = 0;

    // Metrics for Shift settlement
    this.servedCount = 0;
    this.wrongFoodCount = 0;
    this.badTalkCount = 0;
    this.dndCount = 0;
    this.foodFine = 0;
    this.talkFine = 0;
    this.dndFine = 0;

    // Boss & Morale (0 - 100)
    this.bossReputation = 85;

    // Player Inventory / Tray
    this.trayCapacity = 2;
    this.tray = [];

    // Tables (4 Tables)
    this.tables = [
      { id: 1, customer: null, status: 'EMPTY' },
      { id: 2, customer: null, status: 'EMPTY' },
      { id: 3, customer: null, status: 'EMPTY' },
      { id: 4, customer: null, status: 'EMPTY' }
    ];

    // Upgrades
    this.upgrades = {
      shoes: { level: 0, max: 2, name: '氣墊防滑工作鞋', desc: '客人耐心流失速度減緩 15%', cost: 800, icon: '👟' },
      tray: { level: 0, max: 1, name: '鈦合金三層托盤', desc: '托盤攜帶料理上限由 2 盤增加至 3 盤', cost: 1200, icon: '🍱' },
      coffee: { level: 0, max: 2, name: '提神特濃黑咖啡', desc: '服務滿意小費加成 +20%', cost: 700, icon: '☕' },
      eye: { level: 0, max: 1, name: '破謊鷹眼透視鏡', desc: '霸王餐顧客入座時自動高亮提示預警', cost: 1000, icon: '🔍' },
      mask: { level: 0, max: 1, name: '鋼鐵微笑社交面具', desc: '應對失當客訴罰款降低 50%', cost: 900, icon: '🛡️' }
    };

    // State
    this.currentActiveDialogue = null;
    this.currentCheckoutTable = null;

    this.initDOM();
    this.renderFoodMenu('mains');
    this.renderTray();
    this.renderTables();
    this.updateHUD();
    this.setMobileTab('hall');
    this.startShift();
  }

  initDOM() {
    // Mobile Tab Navigation Switcher
    const btnNavHall = document.getElementById('btn-nav-hall');
    const btnNavKitchen = document.getElementById('btn-nav-kitchen');
    const btnJumpHall = document.getElementById('btn-mobile-goto-hall');

    if (btnNavHall) {
      btnNavHall.addEventListener('click', () => {
        this.setMobileTab('hall');
        window.sounds.playPop();
      });
    }
    if (btnNavKitchen) {
      btnNavKitchen.addEventListener('click', () => {
        this.setMobileTab('kitchen');
        window.sounds.playPop();
      });
    }
    if (btnJumpHall) {
      btnJumpHall.addEventListener('click', () => {
        this.setMobileTab('hall');
        window.sounds.playPop();
      });
    }

    // Menu Category Tabs
    document.querySelectorAll('.menu-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.getAttribute('data-cat');
        this.renderFoodMenu(cat);
        window.sounds.playPop();
      });
    });

    // Sound toggle
    document.getElementById('btn-sound-toggle').addEventListener('click', (e) => {
      const isMuted = window.sounds.toggleMute();
      e.target.textContent = isMuted ? '🔇' : '🔊';
    });

    // Pause button
    document.getElementById('btn-pause-game').addEventListener('click', (e) => {
      this.isPaused = !this.isPaused;
      e.target.textContent = this.isPaused ? '▶️' : '⏸️';
      this.showToast(this.isPaused ? '遊戲已暫停' : '遊戲繼續！', 'info');
    });

    // Tray Dump button
    document.getElementById('btn-clear-tray').addEventListener('click', () => {
      if (this.tray.length === 0) return;
      this.tray = [];
      this.renderTray();
      this.applyFine(50, '倒掉食材浪費材料費 -$50');
      window.sounds.playPenalty();
    });

    // Rules Modal
    document.getElementById('btn-rules-help').addEventListener('click', () => {
      document.getElementById('rules-modal').style.display = 'flex';
      window.sounds.playPop();
    });
    document.getElementById('btn-close-rules').addEventListener('click', () => {
      document.getElementById('rules-modal').style.display = 'none';
      window.sounds.playPop();
    });
    document.getElementById('btn-confirm-rules').addEventListener('click', () => {
      document.getElementById('rules-modal').style.display = 'none';
      window.sounds.playPop();
    });

    // Settlement buttons
    document.getElementById('btn-open-shop').addEventListener('click', () => {
      this.openShop();
    });
    document.getElementById('btn-next-shift').addEventListener('click', () => {
      document.getElementById('settlement-modal').style.display = 'none';
      this.startNextShift();
    });

    // Shop buttons
    document.getElementById('btn-close-shop').addEventListener('click', () => {
      document.getElementById('shop-modal').style.display = 'none';
      document.getElementById('settlement-modal').style.display = 'flex';
    });

    // Restart game button
    document.getElementById('btn-restart-game').addEventListener('click', () => {
      location.reload();
    });
  }

  setMobileTab(tab) {
    this.currentMobileTab = tab;
    const btnNavHall = document.getElementById('btn-nav-hall');
    const btnNavKitchen = document.getElementById('btn-nav-kitchen');
    const hallSection = document.getElementById('dining-hall-section');
    const kitchenSection = document.getElementById('kitchen-section');

    if (tab === 'hall') {
      if (btnNavHall) btnNavHall.classList.add('active');
      if (btnNavKitchen) btnNavKitchen.classList.remove('active');
      if (hallSection) hallSection.classList.add('active-mobile-tab');
      if (kitchenSection) kitchenSection.classList.remove('active-mobile-tab');
    } else {
      if (btnNavKitchen) btnNavKitchen.classList.add('active');
      if (btnNavHall) btnNavHall.classList.remove('active');
      if (kitchenSection) kitchenSection.classList.add('active-mobile-tab');
      if (hallSection) hallSection.classList.remove('active-mobile-tab');
    }
  }

  startShift() {
    this.remainingTime = this.shiftDuration;
    this.isPaused = false;
    this.viralFameBoost = 1.0;
    this.updateHUD();

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.gameTick();
      }
    }, 1000);

    // Initial customers
    this.spawnCustomer();
    setTimeout(() => this.spawnCustomer(), 2500);
  }

  gameTick() {
    this.remainingTime--;
    if (this.remainingTime < 0) {
      this.endShift();
      return;
    }

    // Update Tables & Customers
    this.tables.forEach(table => {
      if (table.customer) {
        this.updateCustomer(table);
      }
    });

    // Chance to spawn customer if empty seats available
    const emptyTables = this.tables.filter(t => !t.customer);
    if (emptyTables.length > 0 && Math.random() < 0.32) {
      this.spawnCustomer();
    }

    this.renderTables();
    this.updateHUD();
  }

  spawnCustomer() {
    const emptyTables = this.tables.filter(t => !t.customer);
    if (emptyTables.length === 0) return;

    const table = emptyTables[Math.floor(Math.random() * emptyTables.length)];

    // 8 Archetypes Weighted Random Selection
    const roll = Math.random();
    let archetype = CUSTOMER_TYPES.KIND;

    if (roll < 0.20) {
      archetype = CUSTOMER_TYPES.AGGRESSIVE;
    } else if (roll < 0.36) {
      archetype = CUSTOMER_TYPES.SCAM;
    } else if (roll < 0.50) {
      archetype = CUSTOMER_TYPES.INFLUENCER;
    } else if (roll < 0.64) {
      archetype = CUSTOMER_TYPES.KID;
    } else if (roll < 0.76) {
      archetype = CUSTOMER_TYPES.RUSH;
    } else if (roll < 0.88) {
      archetype = CUSTOMER_TYPES.AUNTIE;
    } else if (roll < 0.95) {
      archetype = CUSTOMER_TYPES.CRITIC;
    } else {
      archetype = CUSTOMER_TYPES.KIND;
    }

    // Customer order (Rush customers always order 1 item!)
    let orderCount = 1;
    if (archetype.type !== 'RUSH') {
      orderCount = Math.random() > 0.45 ? 2 : 1;
    }

    const orderItems = [];
    for (let i = 0; i < orderCount; i++) {
      const food = ALL_FOODS[Math.floor(Math.random() * ALL_FOODS.length)];
      orderItems.push({ ...food, served: false });
    }

    const patienceBoost = 1 + (this.upgrades.shoes.level * 0.15);
    const maxPatience = Math.round(archetype.patience * patienceBoost);

    const randomName = archetype.names[Math.floor(Math.random() * archetype.names.length)];
    const randomAvatar = archetype.avatars[Math.floor(Math.random() * archetype.avatars.length)];

    table.customer = {
      archetype: archetype,
      name: randomName,
      avatar: randomAvatar,
      orders: orderItems,
      maxPatience: maxPatience,
      patience: maxPatience,
      state: 'WAITING_FOOD',
      eatTimer: 0,
      dialogueTriggered: false,
      sneakTimer: 0,
      spawnTime: this.remainingTime
    };
    table.status = 'WAITING';

    if (archetype.type === 'SCAM' && this.upgrades.eye.level > 0) {
      this.showToast(`🔍 鷹眼預警：${randomName} 眼神飄忽，疑似想吃霸王餐！`, 'penalty');
    } else if (archetype.type === 'INFLUENCER') {
      this.showToast(`📸 ${randomName} 入座！拍照要求高，迅速上菜有好評獎勵！`, 'info');
    } else if (archetype.type === 'RUSH') {
      this.showToast(`⚡ ${randomName} 趕時間！快給他送餐有雙倍小費！`, 'info');
    }
  }

  updateCustomer(table) {
    const cust = table.customer;
    if (!cust) return;

    if (cust.state === 'WAITING_FOOD') {
      cust.patience--;

      // Dialogue triggers for Aggressive, Kid, or Influencer
      if ((cust.archetype.type === 'AGGRESSIVE' || cust.archetype.type === 'KID' || cust.archetype.type === 'INFLUENCER') 
          && cust.patience <= 13 && !cust.dialogueTriggered) {
        cust.dialogueTriggered = true;
        this.triggerDialogue(table, cust.archetype.type);
      }

      // Impatient rage quit
      if (cust.patience <= 0) {
        this.handleCustomerRageQuit(table);
      }
    } else if (cust.state === 'EATING') {
      cust.eatTimer--;
      if (cust.eatTimer <= 0) {
        if (cust.archetype.type === 'SCAM') {
          cust.state = 'SNEAKING_AWAY';
          cust.sneakTimer = 10;
          table.status = 'DANGER';
          window.sounds.playAlert();
          this.showToast(`🚨 警告！${cust.name} 假裝講電話拔腿開溜中！快攔截！`, 'penalty');
        } else {
          cust.state = 'READY_TO_PAY';
          table.status = 'CHECKOUT';
        }
      }
    } else if (cust.state === 'SNEAKING_AWAY') {
      cust.sneakTimer--;
      if (cust.sneakTimer <= 0) {
        this.handleDineAndDashEscaped(table);
      }
    }
  }

  // Serve tray to table
  serveTable(tableId) {
    const table = this.tables.find(t => t.id === tableId);
    if (!table || !table.customer) {
      this.showToast('此桌目前沒有客人！', 'info');
      return;
    }

    const cust = table.customer;
    if (cust.state !== 'WAITING_FOOD') {
      this.showToast('客人目前不需要餐點！', 'info');
      return;
    }

    if (this.tray.length === 0) {
      this.showToast('托盤是空的！請先到廚房取餐！', 'info');
      return;
    }

    const unserved = cust.orders.filter(o => !o.served);
    let matchedInTray = -1;
    let matchedOrderIndex = -1;

    for (let i = 0; i < this.tray.length; i++) {
      const trayFood = this.tray[i];
      const matchIdx = unserved.findIndex(o => o.id === trayFood.id);
      if (matchIdx !== -1) {
        matchedInTray = i;
        matchedOrderIndex = cust.orders.findIndex(o => o.id === trayFood.id && !o.served);
        break;
      }
    }

    if (matchedInTray !== -1) {
      const servedFood = this.tray.splice(matchedInTray, 1)[0];
      cust.orders[matchedOrderIndex].served = true;
      this.renderTray();
      window.sounds.playServe();

      // Check if all dishes served
      const remainingUnserved = cust.orders.filter(o => !o.served);
      if (remainingUnserved.length === 0) {
        cust.state = 'EATING';
        cust.eatTimer = 7;
        table.status = 'EATING';

        // Influencer viral bonus check (if served fast!)
        const elapsed = cust.spawnTime - this.remainingTime;
        if (cust.archetype.type === 'INFLUENCER' && elapsed <= 20) {
          this.viralFameBoost = 1.5;
          this.showToast(`🌟 ${cust.name} 發布五星好評！全場小費加乘 1.5 倍！`, 'reward');
        } else if (cust.archetype.type === 'RUSH') {
          this.showToast(`⚡ ${cust.name} 稱讚你出餐超快！給予急單高額加成！`, 'reward');
        } else {
          this.showToast(`成功呈上 ${servedFood.emoji}！${cust.name} 用餐中...`, 'reward');
        }
      } else {
        this.showToast(`呈上 ${servedFood.emoji} ${servedFood.name}！尚欠 1 樣`, 'reward');
      }
    } else {
      // WRONG DISH! Penalty!
      const wrongFood = this.tray[0];
      this.wrongFoodCount++;
      const penalty = 200;
      this.foodFine += penalty;
      this.applyFine(penalty, `上錯菜啦！客人沒點 ${wrongFood.name}！扣薪 -$200！`);
      this.bossReputation = Math.max(0, this.bossReputation - 8);
      cust.patience = Math.max(1, cust.patience - 8);
      window.sounds.playPenalty();
      this.triggerScreenFlash();
    }

    this.renderTables();
    this.updateHUD();
  }

  // Add food to tray
  pickFood(food) {
    if (this.tray.length >= this.trayCapacity) {
      this.showToast(`托盤已滿（上限 ${this.trayCapacity} 盤）！先去送餐或倒掉！`, 'info');
      return;
    }
    this.tray.push({ ...food });
    this.renderTray();
    window.sounds.playPick();
    this.showToast(`已備餐：${food.emoji} ${food.name}`, 'info');
  }

  // Trigger Dialogue Confrontation Modal
  triggerDialogue(table, preferredType = 'AGGRESSIVE') {
    const cust = table.customer;
    if (!cust) return;

    let candidateDialogs = DIALOGUE_EVENTS.filter(d => d.type === preferredType);
    if (candidateDialogs.length === 0) {
      candidateDialogs = DIALOGUE_EVENTS;
    }
    const dialogData = candidateDialogs[Math.floor(Math.random() * candidateDialogs.length)];
    this.currentActiveDialogue = { table, dialogData };

    document.getElementById('dialogue-avatar').textContent = cust.avatar;
    document.getElementById('dialogue-customer-name').textContent = cust.name;
    document.getElementById('dialogue-customer-role').textContent = `顧客特性：${cust.archetype.tag}`;
    document.getElementById('dialogue-speech-text').textContent = dialogData.speech;

    const optionsContainer = document.getElementById('dialogue-options-list');
    optionsContainer.innerHTML = '';

    dialogData.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'dialogue-opt-btn';
      btn.innerHTML = `<span class="opt-prefix">【選項 ${idx + 1}】</span> <span>${opt.text}</span>`;
      btn.onclick = () => this.handleDialogueChoice(opt);
      optionsContainer.appendChild(btn);
    });

    document.getElementById('dialogue-modal').style.display = 'flex';
    window.sounds.playAlert();
  }

  handleDialogueChoice(option) {
    document.getElementById('dialogue-modal').style.display = 'none';

    if (option.correct) {
      this.showToast(option.feedback, 'reward');
      if (this.currentActiveDialogue && this.currentActiveDialogue.table.customer) {
        this.currentActiveDialogue.table.customer.patience += option.patienceBonus || 10;
      }
      this.bossReputation = Math.min(100, this.bossReputation + 5);
      if (option.viralBonus) {
        this.viralFameBoost = 1.5;
      }
      window.sounds.playServe();
    } else {
      let fineAmount = option.fine || 300;
      if (this.upgrades.mask.level > 0) {
        fineAmount = Math.round(fineAmount * 0.5);
      }
      this.badTalkCount++;
      this.talkFine += fineAmount;
      this.applyFine(fineAmount, option.feedback);
      this.bossReputation = Math.max(0, this.bossReputation - 12);
      window.sounds.playPenalty();
      this.triggerScreenFlash();
    }

    this.currentActiveDialogue = null;
    this.renderTables();
    this.updateHUD();
  }

  // Open Checkout Modal
  openCheckoutModal(tableId) {
    const table = this.tables.find(t => t.id === tableId);
    if (!table || !table.customer) return;

    this.currentCheckoutTable = table;
    const cust = table.customer;

    document.getElementById('checkout-table-num').textContent = table.id;
    document.getElementById('checkout-customer-hint').textContent = `客人類型：${cust.archetype.name} (${cust.name})`;

    const itemsList = document.getElementById('checkout-items-list');
    itemsList.innerHTML = '';
    let total = 0;
    cust.orders.forEach(order => {
      total += order.price;
      const row = document.createElement('div');
      row.className = 'bill-item-row';
      row.innerHTML = `<span>${order.emoji} ${order.name}</span> <span>$${order.price}</span>`;
      itemsList.appendChild(row);
    });
    document.getElementById('checkout-total-price').textContent = `$${total}`;

    const isSneaking = cust.state === 'SNEAKING_AWAY';
    document.getElementById('checkout-scam-notice').style.display = isSneaking ? 'block' : 'none';

    const actionsContainer = document.getElementById('checkout-actions-container');
    actionsContainer.innerHTML = '';

    if (isSneaking) {
      const btnCatch = document.createElement('button');
      btnCatch.className = 'btn-catch-scam';
      btnCatch.textContent = '🚨 識破開溜！立刻攔截要求付款！';
      btnCatch.onclick = () => this.handleInterceptScam(total);
      actionsContainer.appendChild(btnCatch);

      const btnCareless = document.createElement('button');
      btnCareless.className = 'btn-secondary';
      btnCareless.textContent = '信他說已經給過錢了 (放行開溜)';
      btnCareless.onclick = () => this.handleCarelessPass(table, total);
      actionsContainer.appendChild(btnCareless);
    } else {
      const btnPay = document.createElement('button');
      btnPay.className = 'btn-checkout';
      btnPay.textContent = '💵 結帳收銀並送客';
      btnPay.onclick = () => this.handleNormalPayment(total);
      actionsContainer.appendChild(btnPay);
    }

    document.getElementById('checkout-modal').style.display = 'flex';
    window.sounds.playPop();
  }

  handleNormalPayment(mealTotal) {
    document.getElementById('checkout-modal').style.display = 'none';
    const table = this.currentCheckoutTable;
    if (!table || !table.customer) return;

    const cust = table.customer;
    let tipPercent = cust.archetype.tipRate;
    if (this.upgrades.coffee.level > 0) {
      tipPercent += (this.upgrades.coffee.level * 0.1);
    }

    // Apply viral fame bonus
    tipPercent *= this.viralFameBoost;

    let tip = Math.round(mealTotal * tipPercent);
    if (cust.archetype.type === 'RUSH') {
      tip += 80; // rushing speed bonus
    }

    this.tipsEarned += tip;
    this.servedCount++;
    this.bossReputation = Math.min(100, this.bossReputation + 4);

    window.sounds.playCash();
    this.showToast(`成功結帳！獲得小費 +$${tip}（${cust.name} 滿意離席）！`, 'reward');

    table.customer = null;
    table.status = 'EMPTY';
    this.currentCheckoutTable = null;

    this.renderTables();
    this.updateHUD();
  }

  handleInterceptScam(mealTotal) {
    document.getElementById('checkout-modal').style.display = 'none';
    const table = this.currentCheckoutTable;
    if (!table || !table.customer) return;

    const bounty = 200;
    this.tipsEarned += bounty;
    this.servedCount++;
    this.bossReputation = Math.min(100, this.bossReputation + 8);

    window.sounds.playCash();
    this.showToast(`🎯 機警抓包！霸王餐慣犯被你攔截乖乖付清，店長頒發獎勵 +$${bounty}！`, 'reward');

    table.customer = null;
    table.status = 'EMPTY';
    this.currentCheckoutTable = null;

    this.renderTables();
    this.updateHUD();
  }

  handleCarelessPass(table, mealTotal) {
    document.getElementById('checkout-modal').style.display = 'none';
    this.handleDineAndDashEscaped(table);
  }

  handleDineAndDashEscaped(table) {
    const cust = table.customer;
    if (!cust) return;

    this.dndCount++;
    const mealCost = cust.orders.reduce((sum, o) => sum + o.price, 0);
    const fine = mealCost + 500;
    this.dndFine += fine;

    this.applyFine(fine, `慘遭霸王餐！${cust.name} 溜之大吉，全額賠償餐費與罰款 -$${fine}！`);
    this.bossReputation = Math.max(0, this.bossReputation - 20);
    window.sounds.playPenalty();
    this.triggerScreenFlash();

    table.customer = null;
    table.status = 'EMPTY';
    this.renderTables();
    this.updateHUD();
  }

  handleCustomerRageQuit(table) {
    const cust = table.customer;
    const fine = 400;
    this.talkFine += fine;
    this.applyFine(fine, `客人 ${cust.name} 等太久發飆摔筷子離開！主管開罰 -$${fine}！`);
    this.bossReputation = Math.max(0, this.bossReputation - 15);
    window.sounds.playPenalty();
    this.triggerScreenFlash();

    table.customer = null;
    table.status = 'EMPTY';
    this.renderTables();
    this.updateHUD();
  }

  applyFine(amount, reason) {
    this.finesTotal += amount;
    this.showToast(`🚨 扣薪處罰：${reason}`, 'penalty');
    this.checkGameOver();
  }

  checkGameOver() {
    const net = this.baseWage + this.tipsEarned - this.finesTotal;
    if (this.bossReputation <= 0 || net < -500) {
      this.triggerGameOver();
    }
  }

  triggerGameOver() {
    clearInterval(this.timerInterval);
    window.sounds.playGameOver();

    const net = this.baseWage + this.tipsEarned - this.finesTotal;
    document.getElementById('gameover-reason').textContent = 
      this.bossReputation <= 0 
        ? '店長滿意度跌破底線，主管當眾怒吼「明天不用來了！」' 
        : `扣薪總額已超越薪資承受極限（淨結算 $${net}），你倒貼破產了！`;

    document.getElementById('gameover-stats').innerHTML = `
      <p>📅 撐過天數：第 ${this.shiftDay} 天</p>
      <p>🍽️ 累計成功服務客人：${this.servedCount} 位</p>
      <p>💸 累計遭扣薪款項：-$${this.finesTotal}</p>
    `;

    document.getElementById('gameover-modal').style.display = 'flex';
  }

  endShift() {
    clearInterval(this.timerInterval);
    window.sounds.playVictory();

    const net = this.baseWage + this.tipsEarned - this.finesTotal;
    this.walletSavings += Math.max(0, net);

    document.getElementById('settlement-day-title').textContent = `第 ${this.shiftDay} 天班工作表現單`;
    document.getElementById('set-base-wage').textContent = `+$${this.baseWage}`;
    document.getElementById('set-served-count').textContent = this.servedCount;
    document.getElementById('set-tips').textContent = `+$${this.tipsEarned}`;
    document.getElementById('set-wrong-food-count').textContent = this.wrongFoodCount;
    document.getElementById('set-food-fine').textContent = `-$${this.foodFine}`;
    document.getElementById('set-bad-talk-count').textContent = this.badTalkCount;
    document.getElementById('set-talk-fine').textContent = `-$${this.talkFine}`;
    document.getElementById('set-dnd-count').textContent = this.dndCount;
    document.getElementById('set-dnd-fine').textContent = `-$${this.dndFine}`;
    document.getElementById('set-net-salary').textContent = `$${net}`;

    const stamp = document.getElementById('settlement-stamp');
    const bossComment = document.getElementById('set-boss-comment');

    if (net >= 1600 && this.bossReputation >= 70) {
      stamp.textContent = '🌟 S級勞模';
      stamp.className = 'settlement-stamp';
      bossComment.textContent = '店長點評：手腳俐落、應對得體！繼續保持，餐廳不能沒有你！';
    } else if (net >= 1000) {
      stamp.textContent = '合格';
      stamp.className = 'settlement-stamp';
      bossComment.textContent = '店長點評：表現還行，明天客人更多，少說廢話多做事！';
    } else {
      stamp.textContent = '⚠️ 劣質警告';
      stamp.className = 'settlement-stamp failed';
      bossComment.textContent = '店長點評：今天差點賠死！再上錯菜或是讓奧客囂張，你就等著捲鋪蓋走人！';
    }

    document.getElementById('settlement-modal').style.display = 'flex';
  }

  startNextShift() {
    this.shiftDay++;
    this.tipsEarned = 0;
    this.finesTotal = 0;
    this.wrongFoodCount = 0;
    this.badTalkCount = 0;
    this.dndCount = 0;
    this.foodFine = 0;
    this.talkFine = 0;
    this.dndFine = 0;
    this.bossReputation = Math.min(100, this.bossReputation + 20);

    this.tables.forEach(t => {
      t.customer = null;
      t.status = 'EMPTY';
    });
    this.tray = [];

    this.renderTray();
    this.renderTables();
    this.startShift();
  }

  // Shop System
  openShop() {
    document.getElementById('settlement-modal').style.display = 'none';
    document.getElementById('shop-wallet-amount').textContent = `$${this.walletSavings}`;

    const list = document.getElementById('upgrades-list');
    list.innerHTML = '';

    Object.keys(this.upgrades).forEach(key => {
      const up = this.upgrades[key];
      const isMax = up.level >= up.max;
      const canAfford = this.walletSavings >= up.cost;

      const item = document.createElement('div');
      item.className = `upgrade-item ${isMax ? 'purchased' : ''}`;
      item.innerHTML = `
        <div class="up-icon-title">
          <span class="up-emoji">${up.icon}</span>
          <div>
            <div class="up-name">${up.name} (Lv.${up.level}/${up.max})</div>
            <div class="up-desc">${up.desc}</div>
          </div>
        </div>
        <div class="up-bottom">
          <span class="up-price">${isMax ? '已升滿' : '$' + up.cost}</span>
          <button class="btn-primary btn-mini" ${isMax || !canAfford ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            ${isMax ? '已擁有' : '購買升級'}
          </button>
        </div>
      `;

      if (!isMax && canAfford) {
        item.querySelector('button').onclick = () => this.buyUpgrade(key);
      }

      list.appendChild(item);
    });

    document.getElementById('shop-modal').style.display = 'flex';
  }

  buyUpgrade(key) {
    const up = this.upgrades[key];
    if (this.walletSavings >= up.cost && up.level < up.max) {
      this.walletSavings -= up.cost;
      up.level++;
      window.sounds.playCash();

      if (key === 'tray') {
        this.trayCapacity = 3;
      }

      this.openShop();
    }
  }

  // Visual Renderers
  renderFoodMenu(category) {
    const container = document.getElementById('food-items-container');
    container.innerHTML = '';
    const items = FOOD_MENU[category] || [];

    items.forEach(food => {
      const card = document.createElement('div');
      card.className = 'food-card';
      card.innerHTML = `
        <div class="food-emoji">${food.emoji}</div>
        <div class="food-title">${food.name}</div>
        <div class="food-price">$${food.price}</div>
      `;
      card.onclick = () => this.pickFood(food);
      container.appendChild(card);
    });
  }

  renderTray() {
    const slotsContainer = document.getElementById('tray-slots');
    slotsContainer.innerHTML = '';
    document.getElementById('tray-capacity-text').textContent = `(${this.tray.length}/${this.trayCapacity})`;

    const miniBadge = document.getElementById('mobile-tray-mini-count');
    if (miniBadge) {
      miniBadge.textContent = `[${this.tray.length}/${this.trayCapacity}]`;
    }

    for (let i = 0; i < this.trayCapacity; i++) {
      const slot = document.createElement('div');
      slot.className = 'tray-slot';

      if (this.tray[i]) {
        slot.classList.add('occupied');
        slot.innerHTML = `
          <div class="slot-emoji">${this.tray[i].emoji}</div>
          <div class="slot-name">${this.tray[i].name}</div>
        `;
      } else {
        slot.innerHTML = `<span style="opacity:0.3; font-size:1.4rem;">＋</span>`;
      }

      slotsContainer.appendChild(slot);
    }
  }

  renderTables() {
    const container = document.getElementById('tables-container');
    container.innerHTML = '';

    let hasAlert = false;
    let occupiedCount = 0;
    let needsUrgentAttention = false;

    this.tables.forEach(table => {
      const card = document.createElement('div');
      card.className = 'table-card';

      if (table.customer) {
        occupiedCount++;
        card.classList.add('occupied');
        if (table.status === 'DANGER') {
          card.classList.add('urgent');
          hasAlert = true;
          needsUrgentAttention = true;
        }

        const cust = table.customer;
        const patiencePercent = Math.max(0, Math.min(100, (cust.patience / cust.maxPatience) * 100));

        if (cust.patience <= 15 || cust.state === 'SNEAKING_AWAY') {
          needsUrgentAttention = true;
        }

        let barColor = '#10b981';
        if (patiencePercent < 35) barColor = '#f43f5e';
        else if (patiencePercent < 65) barColor = '#ffb800';

        let ordersHtml = '';
        cust.orders.forEach(order => {
          ordersHtml += `
            <div class="order-chip ${order.served ? 'served' : ''}">
              ${order.emoji} ${order.name}
            </div>
          `;
        });

        let actionButtons = '';
        if (cust.state === 'WAITING_FOOD') {
          actionButtons = `
            <button class="btn-serve" onclick="window.game.serveTable(${table.id})">
              🍽️ 呈上托盤料理
            </button>
          `;
        } else if (cust.state === 'EATING') {
          actionButtons = `
            <div style="font-size:0.82rem; color:#10b981; font-weight:600; text-align:center; width:100%;">
              😋 用餐中 (約剩 ${cust.eatTimer} 秒)...
            </div>
          `;
        } else if (cust.state === 'READY_TO_PAY') {
          actionButtons = `
            <button class="btn-checkout" onclick="window.game.openCheckoutModal(${table.id})">
              💵 買單結帳
            </button>
          `;
        } else if (cust.state === 'SNEAKING_AWAY') {
          actionButtons = `
            <button class="btn-catch-scam" onclick="window.game.openCheckoutModal(${table.id})">
              🚨 攔截霸王餐 (${cust.sneakTimer}s)！
            </button>
          `;
        }

        card.innerHTML = `
          <div class="table-top-bar">
            <span class="table-num-pill">桌位 0${table.id}</span>
            <span class="table-status-pill status-${table.status.toLowerCase()}">
              ${this.getStatusLabel(table.status)}
            </span>
          </div>

          <div class="table-customer-view">
            <div class="customer-avatar-wrap">
              <span class="avatar-emoji">${cust.avatar}</span>
              <span class="customer-mood-badge">
                ${cust.state === 'SNEAKING_AWAY' ? '🏃' : (cust.patience < 15 ? '💢' : '💬')}
              </span>
            </div>
            <div class="customer-info-col">
              <div class="customer-name-row">
                <span class="cust-name">${cust.name}</span>
                <span class="cust-archetype ${cust.archetype.class}">${cust.archetype.tag}</span>
              </div>
              <div class="patience-container">
                <div class="patience-header">
                  <span>耐心程度</span>
                  <span>${cust.patience}s</span>
                </div>
                <div class="patience-bar-track">
                  <div class="patience-bar-fill" style="width: ${patiencePercent}%; background-color: ${barColor};"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="customer-order-bubble">
            <span style="font-size:0.75rem; color:#94a3b8; font-weight:600;">點單:</span>
            <div class="order-items-preview">${ordersHtml}</div>
          </div>

          <div class="table-action-footer">
            ${actionButtons}
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="table-top-bar">
            <span class="table-num-pill">桌位 0${table.id}</span>
            <span class="table-status-pill status-empty">空桌候位中</span>
          </div>
          <div class="empty-table-state">
            <div class="empty-table-icon">🪑</div>
            <span style="font-size: 0.85rem;">等待客人入座...</span>
          </div>
        `;
      }

      container.appendChild(card);
    });

    document.getElementById('occupancy-info').textContent = `入座率: ${occupiedCount} / 4 桌`;
    document.getElementById('active-alert-pill').style.display = hasAlert ? 'inline-block' : 'none';

    // Mobile Navigation indicators
    const mobileHallBadge = document.getElementById('mobile-hall-badge');
    if (mobileHallBadge) {
      mobileHallBadge.textContent = `(${occupiedCount}/4)`;
    }
    const mobileAlertDot = document.getElementById('mobile-alert-dot');
    if (mobileAlertDot) {
      mobileAlertDot.style.display = needsUrgentAttention ? 'inline-block' : 'none';
    }
  }

  getStatusLabel(status) {
    switch (status) {
      case 'WAITING': return '候餐中';
      case 'EATING': return '享用美食';
      case 'CHECKOUT': return '等候結帳';
      case 'DANGER': return '🚨 企圖開溜！';
      default: return '空桌';
    }
  }

  updateHUD() {
    const mins = Math.floor(this.remainingTime / 60);
    const secs = this.remainingTime % 60;
    document.getElementById('shift-timer').textContent = `倒數: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('shift-day').textContent = `第 ${this.shiftDay} 天班`;

    const net = this.baseWage + this.tipsEarned - this.finesTotal;
    const netEl = document.getElementById('net-salary');
    netEl.textContent = `$${net}`;
    netEl.className = net >= 0 ? 'stat-value text-accent' : 'stat-value text-red';

    document.getElementById('tips-total').textContent = `+$${this.tipsEarned}`;
    document.getElementById('fines-total').textContent = `-$${this.finesTotal}`;

    // Boss Bar & Status Emoji
    const bossFill = document.getElementById('boss-patience-bar');
    bossFill.style.width = `${Math.max(0, this.bossReputation)}%`;

    const bossBadge = document.getElementById('boss-emoji-badge');
    const statusText = document.getElementById('boss-status-text');

    if (this.bossReputation > 80) {
      bossBadge.textContent = '😊 滿意';
      bossBadge.style.color = '#10b981';
      bossBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      statusText.textContent = '店長點評：表現優異，繼續保持！';
    } else if (this.bossReputation > 50) {
      bossBadge.textContent = '😐 普通';
      bossBadge.style.color = '#ffb800';
      bossBadge.style.background = 'rgba(255, 184, 0, 0.2)';
      statusText.textContent = '店長點評：表現尚可，眼睛放亮點！';
    } else if (this.bossReputation > 25) {
      bossBadge.textContent = '😠 焦躁';
      bossBadge.style.color = '#ff9100';
      bossBadge.style.background = 'rgba(255, 145, 0, 0.2)';
      statusText.textContent = '店長點評：客訴太多了！你在夢遊嗎？！';
    } else {
      bossBadge.textContent = '😡 瀕臨炒魷魚';
      bossBadge.style.color = '#f43f5e';
      bossBadge.style.background = 'rgba(244, 63, 94, 0.25)';
      statusText.textContent = '店長怒火：再犯一次錯就直接滾蛋！';
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    while (container.children.length >= 2) {
      container.removeChild(container.firstChild);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'penalty') icon = '🚨';
    if (type === 'reward') icon = '✨';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  triggerScreenFlash() {
    const app = document.getElementById('game-app');
    app.classList.remove('screen-red-flash');
    void app.offsetWidth;
    app.classList.add('screen-red-flash');
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});
