export type MascotVariant = {
  src: string;
  alt: string;
};

const mascotBase = '/images/mascot-optimized/';
const mascotExt = '.webp';
function mascotSrc(name: string): string {
  return `${mascotBase}${name}${mascotExt}`;
}


const variants = {
  home: {
    src: mascotSrc('home-twintails'),
    alt: 'KiKi 双马尾居家猫娘头像',
  },
  homeLeft: {
    src: mascotSrc('home-twintails-left-34'),
    alt: 'KiKi 双马尾居家猫娘左三分之四头像',
  },
  homeRight: {
    src: mascotSrc('home-twintails-right-34'),
    alt: 'KiKi 双马尾居家猫娘右三分之四头像',
  },
  tech: {
    src: mascotSrc('tech-hood-mask'),
    alt: 'KiKi 科技兜帽口罩猫娘头像',
  },
  techLeft: {
    src: mascotSrc('tech-hood-mask-left-34'),
    alt: 'KiKi 科技兜帽口罩猫娘左三分之四头像',
  },
  techRight: {
    src: mascotSrc('tech-hood-mask-right-34'),
    alt: 'KiKi 科技兜帽口罩猫娘右三分之四头像',
  },
  finance: {
    src: mascotSrc('finance-glasses-suit'),
    alt: 'KiKi 金融金丝眼镜职业装猫娘头像',
  },
  financeLeft: {
    src: mascotSrc('finance-glasses-suit-left-34'),
    alt: 'KiKi 金融金丝眼镜职业装猫娘左三分之四头像',
  },
  financeRight: {
    src: mascotSrc('finance-glasses-suit-right-34'),
    alt: 'KiKi 金融金丝眼镜职业装猫娘右三分之四头像',
  },
  politics: {
    src: mascotSrc('politics-hanfu-hairpin'),
    alt: 'KiKi 汉服簪子政治类猫娘头像',
  },
  politicsRight: {
    src: mascotSrc('politics-hanfu-hairpin-right-34'),
    alt: 'KiKi 汉服簪子政治类猫娘右三分之四头像',
  },
  politicsScroll: {
    src: mascotSrc('politics-hanfu-hairpin-scroll'),
    alt: 'KiKi 深色汉服簪子政治类猫娘头像',
  },
  sports: {
    src: mascotSrc('sports-bandage'),
    alt: 'KiKi 运动户外短发创可贴猫娘头像',
  },
  sportsLeft: {
    src: mascotSrc('sports-bandage-left-34'),
    alt: 'KiKi 运动户外短发创可贴猫娘左三分之四头像',
  },
  sportsRight: {
    src: mascotSrc('sports-bandage-right-34'),
    alt: 'KiKi 运动户外短发创可贴猫娘右三分之四头像',
  },
  jk: {
    src: mascotSrc('jk-high-ponytail'),
    alt: 'KiKi 高马尾 JK 猫娘头像',
  },
  jkLeft: {
    src: mascotSrc('jk-high-ponytail-left-34'),
    alt: 'KiKi 高马尾 JK 猫娘左三分之四头像',
  },
  jkRight: {
    src: mascotSrc('jk-high-ponytail-right-34'),
    alt: 'KiKi 高马尾 JK 猫娘右三分之四头像',
  },
} satisfies Record<string, MascotVariant>;

function pickBySeed(options: MascotVariant[], seed = ''): MascotVariant {
  if (!options.length) return variants.home;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return options[hash % options.length];
}

export function getMascotForCategory(category = '', seed = ''): MascotVariant {
  const normalized = category.toLowerCase();
  const hasTech = /科技|ai|人工智能|芯片|半导体|互联网|软件|硬件|模型/.test(normalized);
  const hasFinance = /金融|财经|财报|市场|股票|资本|估值|市值|经济|投资/.test(normalized);
  const hasPolitics = /政治|政务|外交|地缘|国际关系|国家|政府|总统|首相|选举|国会|议会|制裁|安全|军事|中塞|访问/.test(normalized);
  const hasSports = /运动|体育|户外|赛事|足球|篮球|跑步|骑行/.test(normalized);

  if (hasPolitics) {
    return pickBySeed([variants.politics, variants.politicsRight, variants.politicsScroll], seed || category);
  }
  if (hasSports) {
    return pickBySeed([variants.sports, variants.sportsLeft, variants.sportsRight], seed || category);
  }

  if (hasTech && hasFinance) {
    return pickBySeed([
      variants.tech,
      variants.finance,
      variants.techLeft,
      variants.financeRight,
    ], seed || category);
  }

  if (hasTech) {
    return pickBySeed([variants.tech, variants.techLeft, variants.techRight], seed || category);
  }

  if (hasFinance) {
    return pickBySeed([variants.finance, variants.financeLeft, variants.financeRight], seed || category);
  }

  return pickBySeed([variants.home, variants.homeLeft, variants.homeRight, variants.jk, variants.jkLeft, variants.jkRight], seed || category);
}

export function getHomeMascot(): MascotVariant {
  return variants.home;
}

