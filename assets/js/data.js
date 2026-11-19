/**
 * =============================================================================
 * ЕДИНЫЙ ФАЙЛ НАСТРОЕК И КОНТЕНТА ПОРТФОЛИО
 * =============================================================================
 * Здесь удобно менять:
 *  1. Почту для приёма заявок (SITE_CONFIG.email)
 *  2. Ссылки на контакты и соцсети (SITE_CONFIG.contacts и SITE_CONFIG.socials)
 *  3. Ссылку на файл резюме (SITE_CONFIG.resumeUrl)
 *  4. Фотографии и описания проектов (PROJECTS)
 *  5. Отзывы, услуги и FAQ
 */

window.SITE_CONFIG = {
  brandName: 'Булат — Дизайн и разработка',

  // Почта, на которую будут приходить заявки с формы «Купить»
  email: 'bulithonor@gmail.com',

  // Ссылка на ваше резюме (например: 'assets/Хайретдинов_Резюме_3Курс.pdf').
  // Если оставить пустым '', откроется аккуратная карточка-превью резюме.
  resumeUrl: 'assets/Хайретдинов_Резюме_3Курс.pdf',
  resumeDownloadName: 'Хайретдинов_Резюме_3Курс.pdf',

  // Контакты в правой колонке футера — просто вставьте ваши ссылки вместо '#'
  contacts: {
    email: {
      label: 'BULITHONOR@GMAIL.COM',
      href: 'mailto:bulithonor@gmail.com'
    },
    telegram: {
      label: '@IAMNOTBULAT',
      href: '#contact-telegram', // ← Вставьте вашу ссылку, например: 'https://t.me/iamnotbulat'
      placeholderHint: 'Место для ссылки на Telegram (@IAMNOTBULAT)'
    },
    vk: {
      label: '@BULA4',
      href: '#contact-vk', // ← Вставьте вашу ссылку, например: 'https://vk.com/bula4'
      placeholderHint: 'Место для ссылки на VK (@BULA4)'
    },
    other: {
      label: '@BULA4',
      href: '#contact-other', // ← Вставьте вашу ссылку (TenChat / Pinterest / Boosty / др.)
      placeholderHint: 'Место для дополнительной ссылки (@BULA4)'
    }
  },

  // 4 иконки соцсетей в левой колонке футера — вставьте ваши ссылки вместо '#'
  socials: {
    website: {
      title: 'Сайт / Dribbble',
      href: '#social-website' // ← Вставьте вашу ссылку
    },
    behance: {
      title: 'Behance / Портфолио',
      href: '#social-behance' // ← Вставьте вашу ссылку
    },
    education: {
      title: 'Сертификаты / Награды',
      href: '#social-awards' // ← Вставьте вашу ссылку
    },
    profile: {
      title: 'Профиль / Контакт',
      href: '#social-profile' // ← Вставьте вашу ссылку
    }
  },

  // Фотографии на странице «Обо мне» — вставьте пути к файлам, например 'images/portrait.jpg'
  aboutPhotos: {
    portrait: 'assets/images/about/portrait.png', // Портрет без фона в тёмно-бирюзовой рамке
    portraitLabel: 'Булат — портрет',
    lifestyle: '',      // Место для вертикального фото слева внизу
    lifestyleLabel: 'Место для фото (обо мне)'
  }
};

/**
 * Проекты портфолио.
 * Чтобы добавить реальное фото, укажите путь в поле `image` (например: 'images/project-1-1.jpg').
 * Пока `image` пустое (''), отображается аккуратная заглушка «Место для фото проекта N».
 */
window.PROJECTS = [
  {
    id: 'cats-abstraction',
    title: 'Слова в форме',
    subtitle: 'Абстракционизм · Тольяттинская Академия Управления',
    badge: 'SKETCH',
    tools: 'Illustrator, Графика',
    categories: ['sketch'],
    client: 'Тольяттинская Академия Управления',
    type: 'Абстрактная иллюстрация',
    year: '2025',
    linkUrl: '',
    linkLabel: '10 работ',
    coverImage: 'assets/images/cats-abstraction/cover-card.jpg',
    coverPlaceholder: 'Обложка проекта «Слова в форме»',
    bannerImage: 'assets/images/cats-abstraction/cover-banner.jpg',
    bannerPlaceholder: 'Обложка серии «Слова в форме»',
    slides: [
      {
        image: 'assets/images/cats-abstraction/cover-card.jpg',
        heroImage: 'assets/images/cats-abstraction/cover-banner.jpg',
        label: 'Обложка серии',
        fit: 'cover'
      },
      {
        image: 'assets/images/cats-abstraction/cat-01-grust.jpg',
        label: 'Грусть',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-02-dinamika.jpg',
        label: 'Динамика',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-07-tyazhest.jpg',
        label: 'Тяжесть',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-06-labirint.jpg',
        label: 'Лабиринт / Скрытность',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-10-igra.jpg',
        label: 'Игра и радость',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-04-legkost.jpg',
        label: 'Лёгкость / Воздух',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-05-kontrast.jpg',
        label: 'Контраст',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-03-statika.jpg',
        label: 'Статика и равновесие',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-08-teplo.jpg',
        label: 'Тепло и спокойствие',
        fit: 'contain'
      },
      {
        image: 'assets/images/cats-abstraction/cat-09-udivlenie.jpg',
        label: 'Удивление / Напряжение',
        fit: 'contain'
      }
    ],
    context:
      'Учебный проект 2025 года в Тольяттинской Академии Управления. Основная суть — изобразить абстрактные слова, эмоции и физические состояния через образы кошек в стилистике геометрического абстракционизма.',
    problem:
      'Передать отвлечённые понятия («грусть», «динамика», «тяжесть», «лёгкость», «контраст» и др.) без единого слова текста и буквального реализма так, чтобы смысл считывался мгновенно, а вся серия из 10 работ оставалась цельной.',
    solution:
      'Построена выразительная визуальная система на базе простых геометрических форм, пластики силуэта и цветовых акцентов. Острые диагонали передают динамику, массивный тёмный купол — тяжесть, а работа с негативным пространством и контрастом раскрывает характер каждого образа.'
  },
  {
    id: 'kwork-cards',
    title: 'Дизайн визиток',
    subtitle: 'Серия двусторонних концептов для Kwork',
    badge: 'BRAND',
    tools: 'Illustrator, Полиграфия',
    categories: ['brand', 'print'],
    client: 'Портфолио Kwork',
    type: 'Полиграфия и брендинг',
    year: '2026',
    linkUrl: '',
    linkLabel: '6 макетов',
    coverImage: 'assets/images/kwork-cards/cover-card.jpg',
    coverPlaceholder: 'Обложка проекта «Дизайн визиток»',
    bannerImage: 'assets/images/kwork-cards/cover-banner.jpg',
    bannerPlaceholder: 'Обложка серии «Дизайн визиток»',
    slides: [
      {
        image: 'assets/images/kwork-cards/cover-card.jpg',
        heroImage: 'assets/images/kwork-cards/cover-banner.jpg',
        label: 'Обложка серии',
        fit: 'cover'
      },
      {
        image: 'assets/images/kwork-cards/card-01-astrum-front.jpg',
        label: 'Astrum Labs — лицевая',
        fit: 'contain'
      },
      {
        image: 'assets/images/kwork-cards/card-02-astrum-back.jpg',
        label: 'Astrum Labs — оборот',
        fit: 'contain'
      },
      {
        image: 'assets/images/kwork-cards/card-04-vigilcore-logo.jpg',
        label: 'VigilCore — лицевая',
        fit: 'contain'
      },
      {
        image: 'assets/images/kwork-cards/card-03-vigilcore-pattern.jpg',
        label: 'VigilCore — паттерн',
        fit: 'contain'
      },
      {
        image: 'assets/images/kwork-cards/card-05-nimbus-front.jpg',
        label: 'Nimbus Studio — лицевая',
        fit: 'contain'
      },
      {
        image: 'assets/images/kwork-cards/card-06-nimbus-back.jpg',
        label: 'Nimbus Studio — оборот',
        fit: 'contain'
      }
    ],
    context:
      'Коллекция из трёх разноплановых двусторонних визиток, разработанная для витрины услуг на Kwork. Задача — показать гибкость в работе с разными нишами: от технологичного бренда Astrum Labs до премиальной типографики VigilCore и лаконичной дизайн-студии Nimbus Studio.',
    problem:
      'Визитки часто выглядят шаблонно и теряются среди десятков одинаковых карточек. Нужно было создать запоминающиеся макеты в едином высоком качестве печати (CMYK), но с принципиально разным визуальным характером для каждого вымышленного бренда.',
    solution:
      'Для каждого концепта подобрана своя пластика формы, шрифтовая пара и цветовая доминанта: динамичная диагональ и орбитальный знак для Astrum Labs, контрастная антиква и фирменный паттерн для VigilCore, глубокий изумрудный тон и чистая геометрия знака для Nimbus Studio.'
  },
  {
    id: 'calendar-2026',
    title: 'Календарь 2026',
    subtitle: 'Год Лошади · Тольяттинская Академия Управления',
    badge: 'PRINT',
    tools: 'Illustrator, Полиграфия',
    categories: ['sketch', 'print'],
    client: 'Тольяттинская Академия Управления',
    type: 'Полиграфия и иллюстрация',
    year: '2025',
    linkUrl: '',
    linkLabel: '13 листов',
    coverImage: 'assets/images/calendar-2026/cover-card.jpg',
    coverPlaceholder: 'Обложка проекта «Календарь 2026»',
    bannerImage: 'assets/images/calendar-2026/cover-banner.jpg',
    bannerPlaceholder: 'Обложка серии «Календарь 2026»',
    slides: [
      {
        image: 'assets/images/calendar-2026/cover-card.jpg',
        heroImage: 'assets/images/calendar-2026/cover-banner.jpg',
        label: 'Обложка серии',
        fit: 'cover'
      },
      {
        image: 'assets/images/calendar-2026/cal-00-title.jpg',
        label: 'Титульный лист · 2026',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-01-january.jpg',
        label: 'Январь · Ледяной конь',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-02-february.jpg',
        label: 'Февраль',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-03-march.jpg',
        label: 'Март',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-04-april.jpg',
        label: 'Апрель · Пегас',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-05-may.jpg',
        label: 'Май · Цветочная роспись',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-06-june.jpg',
        label: 'Июнь · Солнечный конь',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-07-july.jpg',
        label: 'Июль · Морской конёк',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-08-august.jpg',
        label: 'Август · Огненная лошадь',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-09-september.jpg',
        label: 'Сентябрь · Деловой стиль',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-10-october.jpg',
        label: 'Октябрь · Хэллоуин',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-11-november.jpg',
        label: 'Ноябрь · Ночной Пегас',
        fit: 'contain'
      },
      {
        image: 'assets/images/calendar-2026/cal-12-december.jpg',
        label: 'Декабрь · Новогодний авангард',
        fit: 'contain'
      }
    ],
    context:
      'Академический проект 2025 года в Тольяттинской Академии Управления (2 курс, кафедра прикладной информатики). Разработка авторского перекидного календаря на 2026 год — Год Лошади — в формате горизонтальных листов A4.',
    problem:
      'Сделать 12 календарных страниц и титульный лист визуально непохожими друг на друга, сохранив при этом единый геометрический язык, чёткую читаемость календарной сетки и узнаваемый образ символа года в каждом месяце.',
    solution:
      'Создана модульная серия из 13 иллюстраций, где каждый месяц раскрывает образ лошади через сезонную метафору и собственный цветовой акцент: от ледяного кристалла в январе, цветочной росписи в мае и морского конька в июле до огненной лошади в августе, делового костюма в сентябре и авангардной гирлянды в декабре.'
  },
  {
    id: 'ya-nastavnik',
    title: '«Я — наставник»',
    subtitle: 'Тетрадь и игровые карточки · Центр «Галактика»',
    badge: 'EDTECH',
    tools: 'Illustrator, Вёрстка',
    categories: ['brand', 'print'],
    client: 'Интенсив «Я — наставник» (Галактика)',
    type: 'Образовательный комплект',
    year: '2025',
    linkUrl: '',
    linkLabel: '9 макетов',
    coverImage: 'assets/images/ya-nastavnik/cover-card.jpg',
    coverPlaceholder: 'Обложка проекта «Я — наставник»',
    bannerImage: 'assets/images/ya-nastavnik/cover-banner.jpg',
    bannerPlaceholder: 'Обложка проекта «Я — наставник»',
    slides: [
      {
        image: 'assets/images/ya-nastavnik/cover-card.jpg',
        heroImage: 'assets/images/ya-nastavnik/cover-banner.jpg',
        label: 'Обложка проекта',
        fit: 'cover'
      },
      {
        image: 'assets/images/ya-nastavnik/workbook-01-pains.jpg',
        label: 'Тетрадь · Боли и ЦА',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/workbook-02-solution.jpg',
        label: 'Тетрадь · Решение и цепочка',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/workbook-03-leancanvas.jpg',
        label: 'Тетрадь · Lean Canvas',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/niche-01-eco.jpg',
        label: 'Карточка ниши · Эко-косметика',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/niche-02-winter.jpg',
        label: 'Карточка ниши · Зимний спорт',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/niche-03-gaming.jpg',
        label: 'Карточка ниши · Игры',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/persona-01-maria.jpg',
        label: 'Карточка ЦА · Мария, 32 года',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/persona-02-ilya.jpg',
        label: 'Карточка ЦА · Илья, 20 лет',
        fit: 'contain'
      },
      {
        image: 'assets/images/ya-nastavnik/persona-03-alina.jpg',
        label: 'Карточка ЦА · Алина, 27 лет',
        fit: 'contain'
      }
    ],
    context:
      'Дизайн образовательного печатного комплекта для молодёжного интенсива «Я — наставник» на базе центра «Галактика». Наша команда знакомила десятиклассников с основами предпринимательства, и для ежедневного закрепления лекций и деловых игр понадобились рабочая тетрадь и набор игровых карточек.',
    problem:
      'Сложные бизнес-термины (целевая аудитория, боли клиента, сезонность спроса, Lean Canvas) трудно воспринимаются школьниками на слух. Материалы должны были вовлекать в живую игру, помогать фиксировать инсайты каждый день и оставаться визуально дружелюбными.',
    solution:
      'Разработана единая модульная система из трёх частей: рабочая тетрадь с блоками для записей, подсказками и шаблоном Lean Canvas; иллюстрированные карточки бизнес-ниш с наглядной инфографикой спроса, конкуренции и сезонности; карточки-персоны целевой аудитории для отработки реальных кейсов.'
  },
  {
    id: 'contest-posters',
    title: 'Конкурсные плакаты',
    subtitle: 'Векторная иллюстрация и плакатная графика',
    badge: 'POSTER',
    tools: 'Illustrator, Плакаты',
    categories: ['sketch', 'print'],
    client: 'Дизайн-конкурсы',
    type: 'Плакаты и иллюстрация',
    year: '2025–2026',
    linkUrl: '',
    linkLabel: '3 плаката',
    coverImage: 'assets/images/contest-posters/cover-card.jpg',
    coverPlaceholder: 'Обложка серии «Конкурсные плакаты»',
    bannerImage: 'assets/images/contest-posters/cover-banner.jpg',
    bannerPlaceholder: 'Обложка серии «Конкурсные плакаты»',
    slides: [
      {
        image: 'assets/images/contest-posters/cover-card.jpg',
        heroImage: 'assets/images/contest-posters/cover-banner.jpg',
        label: 'Обложка серии',
        fit: 'cover'
      },
      {
        image: 'assets/images/contest-posters/poster-03-energy-day.jpg',
        label: 'День энергетика · АО «ОЭК»',
        fit: 'contain'
      },
      {
        image: 'assets/images/contest-posters/poster-01-winter-moscow.jpg',
        label: 'Зима в Москве',
        fit: 'contain'
      },
      {
        image: 'assets/images/contest-posters/poster-02-cyber-guardian.jpg',
        label: 'Кибер-страж · Конкурсная работа',
        fit: 'contain'
      }
    ],
    context:
      'Подборка авторских плакатов и векторных иллюстраций, созданных для участия в тематических и отраслевых конкурсах: «День энергетика» для АО «Объединённая энергетическая компания», зимний открыточный плакат «Зима в Москве» и футуристический конкурсный плакат «Кибер-страж».',
    problem:
      'Конкурсный плакат должен мгновенно считываться с первого взгляда, выделяться среди десятков работ жюри и передавать идею темы через чистый силуэт, контрастный цвет и выразительную композицию без лишней перегруженности.',
    solution:
      'Для каждого конкурса найден свой графический ключ: в «Дне энергетика» — геометрия опор ЛЭП на фоне золотого светила и плотная акцидентная типографика; в «Зиме в Москве» и «Кибер-страже» — замкнутая сферическая композиция с контрастной палитрой и ритмом орбитальных деталей.'
  },
  {
    id: 'hodi-brodi',
    title: 'Маскоты «Ходи Броди»',
    subtitle: 'Два концепта бренд-персонажей · Олень и квартет',
    badge: 'MASCOT',
    tools: 'Illustrator, Персонажи',
    categories: ['sketch', 'brand'],
    client: 'Компания «Ходи Броди»',
    type: 'Маскоты и персонажи',
    year: '2026',
    linkUrl: '',
    linkLabel: '2 концепта',
    coverImage: 'assets/images/hodi-brodi/cover-card.jpg',
    coverPlaceholder: 'Обложка проекта «Маскоты Ходи Броди»',
    bannerImage: 'assets/images/hodi-brodi/cover-banner.jpg',
    bannerPlaceholder: 'Обложка проекта «Маскоты Ходи Броди»',
    slides: [
      {
        image: 'assets/images/hodi-brodi/cover-card.jpg',
        heroImage: 'assets/images/hodi-brodi/cover-banner.jpg',
        label: 'Обложка проекта',
        fit: 'cover'
      },
      {
        image: 'assets/images/hodi-brodi/deer-00-sheet.jpg',
        label: 'Концепт 01 · Олень (линейка поз)',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/paper-00-quartet.jpg',
        label: 'Концепт 02 · Квартет персонажей',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/deer-01-walk-violet.jpg',
        label: 'Олень · Прогулка (индиго)',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/deer-02-walk-lime.jpg',
        label: 'Олень · Прогулка (лайм)',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/deer-03-idea.jpg',
        label: 'Олень · Эврика и идея',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/deer-04-joy.jpg',
        label: 'Олень · Радость',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/deer-05-peace.jpg',
        label: 'Олень · Приветствие',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/paper-01-green.jpg',
        label: 'Квартет · Радость и энергия',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/paper-02-purple.jpg',
        label: 'Квартет · Спокойствие',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/paper-03-blue.jpg',
        label: 'Квартет · Нежность и забота',
        fit: 'contain'
      },
      {
        image: 'assets/images/hodi-brodi/paper-04-yellow.jpg',
        label: 'Квартет · Вдохновение',
        fit: 'contain'
      }
    ],
    context:
      'Разработка фирменных маскотов для компании «Ходи Броди» (2026). В рамках поиска визуального голоса бренда были проработаны два контрастных направления: сольный харизматичный маскот-олень и объединённая команда из четырёх бумажных персонажей.',
    problem:
      'Создать живых, запоминающихся персонажей, которые органично живут в цифровых коммуникациях, стикерах, интерфейсах и мерче бренда, передавая эмоции и дружелюбный характер «Ходи Броди».',
    solution:
      'Первый концепт — современный олень в авиаторах, с неоновыми рожками и спортивной куртке (5 рабочих поз и две цветовые версии). Второй концепт — единый papercraft-квартет из четырёх цветных персонажей, каждый из которых отвечает за отдельное настроение и сценарий общения с аудиторией.'
  }
];

/**
 * Отзывы на главной странице
 */
window.TESTIMONIALS = [
  {
    quote:
      '«Работа с этим дизайнером превзошла все ожидания. Проект был выполнен в срок, а результат помог увеличить конверсию на 40% за первые два месяца»',
    author: 'Алексей Иванов',
    role: 'CEO, TechStart Inc.',
    rating: '5.0',
    avatar: '' // ← При желании укажите путь к фото автора
  },
  {
    quote:
      '«Булат глубоко погрузился в задачи студии и предложил смелую айдентику, которая сразу попала в нашу аудиторию. Заявки на пробные занятия выросли вдвое»',
    author: 'Мария Соколова',
    role: 'Основатель студии «Пластилин»',
    rating: '5.0',
    avatar: ''
  },
  {
    quote:
      '«Очень комфортная коммуникация, чёткие сроки и продуманный до мелочей UI-кит. Разработчики смогли сверстать макеты без единого лишнего вопроса»',
    author: 'Дмитрий Орлов',
    role: 'Product Lead, Nordic Roast',
    rating: '5.0',
    avatar: ''
  }
];

/**
 * Услуги с адекватными рыночными ценами и сроками
 */
window.SERVICES = [
  {
    title: 'UI/UX дизайн',
    projectType: 'UI/UX дизайн',
    items: [
      'UX-аудит и аналитика',
      'Проектирование логики',
      'Интерактивные прототипы',
      'Создание UI-китов'
    ],
    duration: '2–4 недели',
    price: 'от 45 000 ₽'
  },
  {
    title: 'Дизайн сайтов',
    projectType: 'Дизайн сайта',
    items: [
      'Анализ конкурентов',
      'Продуманная структура',
      'Трендовый визуал',
      'Адаптация под мобильные'
    ],
    duration: '1–3 недели',
    price: 'от 35 000 ₽'
  },
  {
    title: 'Редизайн проектов',
    projectType: 'Редизайн проекта',
    items: [
      'Поиск узких мест UX',
      'Улучшение навигации',
      'Обновление визуала',
      'Повышение конверсии'
    ],
    duration: '1–2 недели',
    price: 'от 25 000 ₽'
  },
  {
    title: 'Графический дизайн',
    projectType: 'Графический дизайн',
    items: [
      'Креативная концепция',
      'Афиши и постеры',
      'Рекламные креативы',
      'Подготовка к печати'
    ],
    duration: '3–7 дней',
    price: 'от 10 000 ₽'
  },
  {
    title: 'Оформление соцсетей',
    projectType: 'Оформление соц-сетей',
    items: [
      'Визуальная концепция',
      'Дизайн обложек и аватаров',
      'Шаблоны для постов',
      'Оформление сторис'
    ],
    duration: '5–10 дней',
    price: 'от 15 000 ₽'
  },
  {
    title: 'Брендинг',
    projectType: 'Брендинг',
    items: [
      'Разработка логотипа',
      'Палитра и типографика',
      'Фирменные носители',
      'Гайдбук и брендбук'
    ],
    duration: '2–3 недели',
    price: 'от 40 000 ₽'
  }
];

/**
 * Часто задаваемые вопросы (FAQ) на странице «Услуги»
 */
window.FAQ_ITEMS = [
  {
    question: 'Как происходит оплата?',
    answer:
      'Работаю по предоплате 50% перед началом этапа и 50% по завершении. Возможна поэтапная оплата для больших проектов.',
    openByDefault: true
  },
  {
    question: 'Какие сроки разработки?',
    answer:
      'Графический дизайн и оформление соцсетей занимают от 3 до 10 дней, дизайн сайтов, брендинг и UI/UX — от 1 до 4 недель. Точный график фиксируем до старта работы.',
    openByDefault: false
  },
  {
    question: 'Работаете ли вы по договору?',
    answer:
      'Да, всегда заключаю официальный договор с фиксацией этапов, сроков и итоговой стоимости. Это гарантирует прозрачность и защиту обеих сторон.',
    openByDefault: false
  },
  {
    question: 'Есть ли поддержка?',
    answer:
      'Да, предоставляю 30 дней бесплатной поддержки после сдачи проекта: отвечаю на вопросы разработчиков и помогаю с мелкими корректировками.',
    openByDefault: false
  }
];
