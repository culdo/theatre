import type {Pointer} from '@theatre/dataverse'
import {val} from '@theatre/dataverse'
import {usePrism} from '@theatre/react'
import type {Keyframe} from '@theatre/core/projects/store/types/SheetState_Historic'
import type {TrackData} from '@theatre/core/projects/store/types/SheetState_Historic'
import type {IRange} from '@theatre/shared/utils/types'
import type {IAggregateKeyframesAtPosition} from '@theatre/studio/panels/SequenceEditorPanel/DopeSheet/Right/AggregatedKeyframeTrack/AggregateKeyframeEditor/AggregateKeyframeEditor'

function useViewPortKfs(range: Pointer<IRange>, trackData: TrackData) {
  return usePrism(() => {
    const start = val(range.start)
    const end = val(range.end)

    const results: [Keyframe, number][] = []

    for (const [idx, kf] of trackData.keyframes.entries()) {
      if (kf.position >= start && end > kf.position) {
        if (results.length == 0 && idx > 0) {
          results.push([trackData.keyframes[idx - 1], idx - 1])
        }
        results.push([kf, idx])
      }
    }
    return results
  }, [range, trackData])
}

function useViewPortAggregatedKfs(
  range: Pointer<IRange>,
  trackData: IAggregateKeyframesAtPosition[],
) {
  return usePrism(() => {
    const start = val(range.start)
    const end = val(range.end)

    const results: IAggregateKeyframesAtPosition[] = []

    for (const [idx, kf] of trackData.entries()) {
      if (kf.position >= start && end > kf.position) {
        if (results.length == 0 && idx > 0) {
          results.push(trackData[idx - 1])
        }
        results.push(kf)
      }
    }
    return results
  }, [range, trackData])
}

export {useViewPortAggregatedKfs, useViewPortKfs}
