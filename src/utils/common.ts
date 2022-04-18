import { IHotVideo } from "models/video-hot/type";

export const VIDEO_VIEW_DISTRIBUTION = [
  100, 500, 1000, 5000, 10000, 30000, 50000, 100000, 200000, 300000, 400000,
  500000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000, 20000000,
  30000000, 50000000, 75000000, 100000000,
];

export const queryVideoViewDistribution = ({ id }: { id: string }) => {
  let query = { $facet: {} };
  for (let i = VIDEO_VIEW_DISTRIBUTION.length - 1; i > 0; i--) {
    let big = VIDEO_VIEW_DISTRIBUTION[i];
    let small = VIDEO_VIEW_DISTRIBUTION[i - 1];
    query["$facet"][VIDEO_VIEW_DISTRIBUTION[i]] = [
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
