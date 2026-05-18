import { RadarScoreWidget } from "../components/RadarWidget";
import { PieScoreWidget } from "../components/PieWidget";
import { HeatmapScoreWidget } from "../components/HeatmapWidget";
import { CompletionDonutWidget } from "../components/CompletionDonutWidget";
import { FormatColumnWidget } from "../components/FormatColumnWidget";
import { LineScoreWidget } from "../components/LineWidget";
import { FavoriteActivityWidget } from "../components/FavoriteActivityWidget";

export const listOfCharts = [
    {
      id: 1, 
      Widget: <RadarScoreWidget />,
      aspectClass: "aspect-square"
    },
    {
      id: 2,
      Widget: <PieScoreWidget />,
      aspectClass: "aspect-square"
    },
    {
      id: 3,
      Widget: <HeatmapScoreWidget />,
      aspectClass: "aspect-video"
    },
    {
      id: 4,
      Widget: <CompletionDonutWidget />,
      aspectClass: "aspect-[4/3]"
    },
    {
      id: 5,
      Widget: <FormatColumnWidget />,
      aspectClass: "aspect-video"
    },
    {
      id: 6,
      Widget: <LineScoreWidget />,
      aspectClass: "aspect-[4/3]"
    },
    {
      id: 7,
      Widget: <FavoriteActivityWidget />,
      aspectClass: "aspect-[4/3]"
    }
  ]