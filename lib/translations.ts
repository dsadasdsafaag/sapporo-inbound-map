import { Locale } from './i18n';

export const translations: Record<Locale, {
  header: {
    title: string;
  };
  footer: {
    text: string;
  };
  cta: {
    viewDetails: string;
    bookNow: string;
    officialTickets: string;
    backToMap: string;
  };
  filters: {
    all: string;
    today: string;
    weekend: string;
    nextWeek: string;
  };
  layers: {
    events: string;
    skiResorts: string;
    lessons: string;
    rentals: string;
    shuttle: string;
    onsen: string;
  };
}> = {
  en: {
    header: {
      title: 'Sapporo Inbound Map',
    },
    footer: {
      text: 'Find your perfect Sapporo experience • Book with trusted partners',
    },
    cta: {
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      officialTickets: 'Official Tickets',
      backToMap: 'Back to Map',
    },
    filters: {
      all: 'All',
      today: 'Today',
      weekend: 'Weekend',
      nextWeek: 'Next Week',
    },
    layers: {
      events: 'Events',
      skiResorts: 'Ski Resorts',
      lessons: 'Lessons',
      rentals: 'Rentals',
      shuttle: 'Shuttle',
      onsen: 'Onsen',
    },
  },
  ja: {
    header: {
      title: '札幌インバウンドマップ',
    },
    footer: {
      text: '札幌の完璧な体験を見つけよう • 信頼できるパートナーで予約',
    },
    cta: {
      viewDetails: '詳細を見る',
      bookNow: '今すぐ予約',
      officialTickets: '公式チケット',
      backToMap: 'マップに戻る',
    },
    filters: {
      all: 'すべて',
      today: '今日',
      weekend: '週末',
      nextWeek: '来週',
    },
    layers: {
      events: 'イベント',
      skiResorts: 'スキーリゾート',
      lessons: 'レッスン',
      rentals: 'レンタル',
      shuttle: 'シャトル',
      onsen: '温泉',
    },
  },
  'zh-Hans': {
    header: {
      title: '札幌入境地图',
    },
    footer: {
      text: '找到您完美的札幌体验 • 通过可信赖的合作伙伴预订',
    },
    cta: {
      viewDetails: '查看详情',
      bookNow: '立即预订',
      officialTickets: '官方门票',
      backToMap: '返回地图',
    },
    filters: {
      all: '全部',
      today: '今天',
      weekend: '周末',
      nextWeek: '下周',
    },
    layers: {
      events: '活动',
      skiResorts: '滑雪场',
      lessons: '课程',
      rentals: '租赁',
      shuttle: '班车',
      onsen: '温泉',
    },
  },
  'zh-Hant': {
    header: {
      title: '札幌入境地圖',
    },
    footer: {
      text: '找到您完美的札幌體驗 • 透過可信賴的合作夥伴預訂',
    },
    cta: {
      viewDetails: '查看詳情',
      bookNow: '立即預訂',
      officialTickets: '官方門票',
      backToMap: '返回地圖',
    },
    filters: {
      all: '全部',
      today: '今天',
      weekend: '週末',
      nextWeek: '下週',
    },
    layers: {
      events: '活動',
      skiResorts: '滑雪場',
      lessons: '課程',
      rentals: '租賃',
      shuttle: '班車',
      onsen: '溫泉',
    },
  },
  ko: {
    header: {
      title: '삿포로 인바운드 지도',
    },
    footer: {
      text: '완벽한 삿포로 경험을 찾아보세요 • 신뢰할 수 있는 파트너와 예약',
    },
    cta: {
      viewDetails: '자세히 보기',
      bookNow: '지금 예약',
      officialTickets: '공식 티켓',
      backToMap: '지도로 돌아가기',
    },
    filters: {
      all: '전체',
      today: '오늘',
      weekend: '주말',
      nextWeek: '다음 주',
    },
    layers: {
      events: '이벤트',
      skiResorts: '스키 리조트',
      lessons: '레슨',
      rentals: '렌탈',
      shuttle: '셔틀',
      onsen: '온천',
    },
  },
  es: {
    header: {
      title: 'Mapa de Sapporo para Turistas',
    },
    footer: {
      text: 'Encuentra tu experiencia perfecta en Sapporo • Reserva con socios de confianza',
    },
    cta: {
      viewDetails: 'Ver Detalles',
      bookNow: 'Reservar Ahora',
      officialTickets: 'Entradas Oficiales',
      backToMap: 'Volver al Mapa',
    },
    filters: {
      all: 'Todos',
      today: 'Hoy',
      weekend: 'Fin de Semana',
      nextWeek: 'Próxima Semana',
    },
    layers: {
      events: 'Eventos',
      skiResorts: 'Estaciones de Esquí',
      lessons: 'Lecciones',
      rentals: 'Alquileres',
      shuttle: 'Transporte',
      onsen: 'Onsen',
    },
  },
};

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.en;
}
