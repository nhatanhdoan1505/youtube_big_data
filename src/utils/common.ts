import keywordExtractor = require("keyword-extractor");
import { LanguageName } from "keyword-extractor/types/lib/keyword_extractor";
import languagedetect = require("languagedetect");
const HTML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&cent;": "¢",
  "&pound;": "£",
  "&yen;": "¥",
  "&euro;": "€",
  "&copy;": "©",
  "&reg;": "®",
  "&nbsp;": "",
};

const LANGUAGE_DETECTOR = [
  "english",
  "spanish",
  "polish",
  "german",
  "french",
  "italian",
  "dutch",
  "romanian",
  "russian",
  "portuguese",
  "swedish",
  "arabic",
  "persian",
];

export const VIDEO_VIEW_DISTRIBUTION = [
  100, 500, 1000, 5000, 10000, 30000, 50000, 100000, 200000, 300000, 400000,
  500000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000, 20000000,
  30000000, 50000000, 75000000, 100000000,
];

export const CHANNEL_SUBSCRIBER_DISTRIBUTION = [
  50000, 100000, 500000, 1000000, 3000000, 50000001,
];

export const queryVideoViewDistribution = ({ id }: { id: string }) => {
  let query = { $facet: {} };
  for (let i = VIDEO_VIEW_DISTRIBUTION.length - 1; i > 0; i--) {
    let big = VIDEO_VIEW_DISTRIBUTION[i];
    let small = VIDEO_VIEW_DISTRIBUTION[i - 1];
    query["$facet"][VIDEO_VIEW_DISTRIBUTION[i]] = [
      { $project: { channelInformation: 1, views: 1 } },
      {
        $match: {
          $and: [
            { "channelInformation.id": id },
            { views: { $lt: big } },
            { views: { $gte: small } },
          ],
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ];
  }
  query["$facet"][VIDEO_VIEW_DISTRIBUTION[0]] = [
    { $project: { channelInformation: 1, views: 1 } },
    {
      $match: {
        $and: [
          { "channelInformation.id": id },
          { views: { $lt: [VIDEO_VIEW_DISTRIBUTION[0]] } },
        ],
      },
    },
  ];
  return query;
};

export const queryVideoDurationStatistic = () => {
  let query = { $facet: {} };
  for (let i = 0; i < 3601; i += 10) {
    let big = i + 10;
    let small = i;
    if (i >= 3601) {
      query["$facet"][i] = [
        { $project: { duration: 1, views: 1 } },
        {
          $match: {
            $and: [{ duration: { $gte: small } }],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            averageViews: { $avg: "$views" },
          },
        },
      ];
    } else {
      query["$facet"][i] = [
        { $project: { duration: 1, views: 1 } },
        {
          $match: {
            $and: [{ duration: { $lt: big } }, { duration: { $gte: small } }],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            averageViews: { $avg: "$views" },
          },
        },
      ];
    }
  }
  return query;
};

export const queryVideoDurationViews = () => {
  let query = { $facet: {} };
  for (let i = 0; i < 3601; i += 10) {
    let big = i + 10;
    let small = i;
    if (i >= 3601) {
      query["$facet"][i] = [
        { $project: { duration: 1, views: 1 } },
        {
          $match: {
            $and: [{ duration: { $gte: small } }],
          },
        },
        { $group: { _id: null, views: { $sum: "$views" } } },
      ];
    } else {
      query["$facet"][i] = [
        { $project: { duration: 1, views: 1 } },
        {
          $match: {
            $and: [{ duration: { $lt: big } }, { duration: { $gte: small } }],
          },
        },
        { $group: { _id: null, views: { $sum: "$views" } } },
      ];
    }
  }
  return query;
};

export const queryVideoViewStatistic = () => {
  let query = { $facet: {} };
  let VIEW_STATISTIC = VIDEO_VIEW_DISTRIBUTION.slice(7);
  for (let i = VIEW_STATISTIC.length - 1; i > 0; i--) {
    let big = VIEW_STATISTIC[i];
    let small = VIEW_STATISTIC[i - 1];
    query["$facet"][VIEW_STATISTIC[i]] = [
      { $project: { views: 1 } },
      {
        $match: {
          $and: [{ views: { $lt: big } }, { views: { $gte: small } }],
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ];
  }
  return query;
};

export const removeHtmlEntities = (str: string) => {
  Object.keys(HTML_ENTITIES).forEach((e) => {
    str = str.replace(new RegExp(e, "g"), HTML_ENTITIES[e]);
  });
  return str;
};

export const detectLanguages = (text: string): string[] => {
  const lngDetector = new languagedetect();
  let languageList = lngDetector.detect(text);
  return languageList.map((language) => language[0]);
};

export const detectKeyword = (text: string): string[] => {
  const languageList = detectLanguages(text);
  let language = "english";
  for (let lang of languageList) {
    if (LANGUAGE_DETECTOR.includes(lang)) {
      language = lang;
      break;
    }
  }
  text = removeHtmlEntities(text);
  text = text.replace(/[&\/\\#|,+()$~%.'":*?<>{}]/g, "");
  let exactor: any = keywordExtractor;
  return exactor.extract(text, {
    language: language as LanguageName,
    remove_digits: true,
    return_changed_case: true,
    return_chained_words: true,
    remove_duplicates: false,
  });
};

export const queryUploadStatistic = [
  {
    $addFields: {
      averageSub: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $gte: ["$subscribe", 10000] },
                  { $lte: ["$subscribe", 50000] },
                ],
              },
              then: 50000,
            },
            {
              case: {
                $and: [
                  { $gt: ["$subscribe", 50000] },
                  { $lte: ["$subscribe", 100000] },
                ],
              },
              then: 100000,
            },
            {
              case: {
                $and: [
                  { $gt: ["$subscribe", 100000] },
                  { $lte: ["$subscribe", 500000] },
                ],
              },
              then: 500000,
            },
            {
              case: {
                $and: [
                  { $gt: ["$subscribe", 500000] },
                  { $lte: ["$subscribe", 1000000] },
                ],
              },
              then: 1000000,
            },
            {
              case: {
                $and: [
                  { $gt: ["$subscribe", 1000000] },
                  { $lte: ["$subscribe", 3000000] },
                ],
              },
              then: 3000000,
            },
            {
              case: {
                $and: [{ $gt: ["$subscribe", 3000000] }],
              },
              then: 3000001,
            },
          ],
          default: 0,
        },
      },
    },
  },
  {
    $facet: {
      50000: [
        { $match: { averageSub: 50000 } },
        {
          $addFields: {
            uploadGap: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 0] },
                        { $lte: ["$averageUpload", 2] },
                      ],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 2] },
                        { $lte: ["$averageUpload", 4] },
                      ],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 4] },
                        { $lte: ["$averageUpload", 6] },
                      ],
                    },
                    then: 6,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 6] },
                        { $lte: ["$averageUpload", 8] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 8] },
                        { $lte: ["$averageUpload", 10] },
                      ],
                    },
                    then: 10,
                  },
                  {
                    case: {
                      $and: [{ $gt: ["$averageUpload", 10] }],
                    },
                    then: 11,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        { $match: { uploadGap: { $ne: 0 } } },
        {
          $group: {
            _id: "$uploadGap",
            count: { $sum: 1 },
            totalUpload: { $sum: "$averageUpload" },
          },
        },
      ],
      100000: [
        { $match: { averageSub: 100000 } },
        {
          $addFields: {
            uploadGap: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 0] },
                        { $lte: ["$averageUpload", 2] },
                      ],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 2] },
                        { $lte: ["$averageUpload", 4] },
                      ],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 4] },
                        { $lte: ["$averageUpload", 6] },
                      ],
                    },
                    then: 6,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 6] },
                        { $lte: ["$averageUpload", 8] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 8] },
                        { $lte: ["$averageUpload", 10] },
                      ],
                    },
                    then: 10,
                  },
                  {
                    case: {
                      $and: [{ $gt: ["$averageUpload", 10] }],
                    },
                    then: 11,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        { $match: { uploadGap: { $ne: 0 } } },
        {
          $group: {
            _id: "$uploadGap",
            count: { $sum: 1 },
            totalUpload: { $sum: "$averageUpload" },
          },
        },
      ],
      500000: [
        { $match: { averageSub: 500000 } },
        {
          $addFields: {
            uploadGap: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 0] },
                        { $lte: ["$averageUpload", 2] },
                      ],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 2] },
                        { $lte: ["$averageUpload", 4] },
                      ],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 4] },
                        { $lte: ["$averageUpload", 6] },
                      ],
                    },
                    then: 6,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 6] },
                        { $lte: ["$averageUpload", 8] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 8] },
                        { $lte: ["$averageUpload", 10] },
                      ],
                    },
                    then: 10,
                  },
                  {
                    case: {
                      $and: [{ $gt: ["$averageUpload", 10] }],
                    },
                    then: 11,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        { $match: { uploadGap: { $ne: 0 } } },
        {
          $group: {
            _id: "$uploadGap",
            count: { $sum: 1 },
            totalUpload: { $sum: "$averageUpload" },
          },
        },
      ],
      1000000: [
        { $match: { averageSub: 1000000 } },
        {
          $addFields: {
            uploadGap: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 0] },
                        { $lte: ["$averageUpload", 2] },
                      ],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 2] },
                        { $lte: ["$averageUpload", 4] },
                      ],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 4] },
                        { $lte: ["$averageUpload", 6] },
                      ],
                    },
                    then: 6,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 6] },
                        { $lte: ["$averageUpload", 8] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 8] },
                        { $lte: ["$averageUpload", 10] },
                      ],
                    },
                    then: 10,
                  },
                  {
                    case: {
                      $and: [{ $gt: ["$averageUpload", 10] }],
                    },
                    then: 11,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        { $match: { uploadGap: { $ne: 0 } } },
        {
          $group: {
            _id: "$uploadGap",
            count: { $sum: 1 },
            totalUpload: { $sum: "$averageUpload" },
          },
        },
      ],
      3000000: [
        { $match: { averageSub: 3000000 } },
        {
          $addFields: {
            uploadGap: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 0] },
                        { $lte: ["$averageUpload", 2] },
                      ],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 2] },
                        { $lte: ["$averageUpload", 4] },
                      ],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 4] },
                        { $lte: ["$averageUpload", 6] },
                      ],
                    },
                    then: 6,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 6] },
                        { $lte: ["$averageUpload", 8] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 8] },
                        { $lte: ["$averageUpload", 10] },
                      ],
                    },
                    then: 10,
                  },
                  {
                    case: {
                      $and: [{ $gt: ["$averageUpload", 10] }],
                    },
                    then: 11,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        { $match: { uploadGap: { $ne: 0 } } },
        {
          $group: {
            _id: "$uploadGap",
            count: { $sum: 1 },
            totalUpload: { $sum: "$averageUpload" },
          },
        },
      ],
      3000001: [
        { $match: { averageSub: 3000001 } },
        {
          $addFields: {
            uploadGap: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 0] },
                        { $lte: ["$averageUpload", 2] },
                      ],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 2] },
                        { $lte: ["$averageUpload", 4] },
                      ],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 4] },
                        { $lte: ["$averageUpload", 6] },
                      ],
                    },
                    then: 6,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 6] },
                        { $lte: ["$averageUpload", 8] },
                      ],
                    },
                    then: 8,
                  },
                  {
                    case: {
                      $and: [
                        { $gt: ["$averageUpload", 8] },
                        { $lte: ["$averageUpload", 10] },
                      ],
                    },
                    then: 10,
                  },
                  {
                    case: {
                      $and: [{ $gt: ["$averageUpload", 10] }],
                    },
                    then: 11,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        { $match: { uploadGap: { $ne: 0 } } },
        {
          $group: {
            _id: "$uploadGap",
            count: { $sum: 1 },
            totalUpload: { $sum: "$averageUpload" },
          },
        },
      ],
    },
  },
];

export const queryChannelSubscriberStatistic = () => {
  let query = { $facet: {} };
  for (let i = CHANNEL_SUBSCRIBER_DISTRIBUTION.length - 1; i > 0; i--) {
    let big = CHANNEL_SUBSCRIBER_DISTRIBUTION[i];
    let small = CHANNEL_SUBSCRIBER_DISTRIBUTION[i - 1];
    if (i === CHANNEL_SUBSCRIBER_DISTRIBUTION.length - 1) {
      query["$facet"][CHANNEL_SUBSCRIBER_DISTRIBUTION[i]] = [
        { $project: { subscribe: 1 } },
        {
          $match: {
            $and: [
              { subscribe: { $gte: CHANNEL_SUBSCRIBER_DISTRIBUTION[i - 1] } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ];
      continue;
    }
    query["$facet"][CHANNEL_SUBSCRIBER_DISTRIBUTION[i]] = [
      { $project: { subscribe: 1 } },
      {
        $match: {
          $and: [{ subscribe: { $lt: big } }, { subscribe: { $gte: small } }],
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ];
  }
  return query;
};
