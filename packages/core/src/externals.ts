import { isArr } from '@aamuapp/designable-shared'
import { untracked } from '@formily/reactive'
import { DEFAULT_DRIVERS, DEFAULT_EFFECTS, DEFAULT_SHORTCUTS } from './presets'
import { Engine, TreeNode } from './models'
import {
  IEngineProps,
  IResourceCreator,
  IBehaviorCreator,
  IDesignerLocales,
  IResource,
  IBehavior,
  IBehaviorHost,
  IResourceHost,
  SourceType,
} from './types'
import { mergeLocales } from './internals'

export const isBehaviorHost = (val: any): val is IBehaviorHost =>
  val?.Behavior && isBehaviorList(val.Behavior)

export const isBehaviorList = (val: any): val is IBehavior[] =>
  Array.isArray(val) && val.every(isBehavior)

export const isBehavior = (val: any): val is IBehavior =>
  val?.name ||
  val?.selector ||
  val?.extends ||
  val?.designerProps ||
  val?.designerLocales

export const isResourceHost = (val: any): val is IResourceHost =>
  val?.Resource && isResourceList(val.Resource)

export const isResourceList = (val: any): val is IResource[] =>
  Array.isArray(val) && val.every(isResource)

export const isResource = (val: any): val is IResource =>
  val?.node && !!val.node.isSourceNode && val.node instanceof TreeNode

export const createLocales = (...packages: IDesignerLocales[]) => {
  const results = {}
  packages.forEach((locales) => {
    mergeLocales(results, locales)
  })
  return results
}

export const createBehavior = (
  ...behaviors: Array<IBehaviorCreator | IBehaviorCreator[]>
): IBehavior[] => {
  return behaviors.reduce((buf: any[], behavior) => {
    if (isArr(behavior)) return buf.concat(createBehavior(...behavior))
    const { selector } = behavior || {}
    if (!selector) return buf
    if (typeof selector === 'string') {
      behavior.selector = (node) => node.componentName === selector
    }
    return buf.concat(behavior)
  }, [])
}

export function createResource(
  type: SourceType | IResourceCreator,
  ...sources: IResourceCreator[]
): IResource[] {
  let _type = 'Others'
  if (typeof type === 'object') {
    sources.unshift(type)
  } else {
    _type = type
  }
  return sources.reduce<IResource[]>((buf, source) => {
    return buf.concat({
      ...source,
      type: _type,
      node: new TreeNode({
        componentName: '$$ResourceNode$$',
        isSourceNode: true,
        children: source.elements || [],
        props: {},
      }),
    })
  }, [])
}

export const createDesigner = (props: Partial<IEngineProps<Engine>> = {}) => {
  const drivers = props.drivers || []
  const effects = props.effects || []
  const shortcuts = props.shortcuts || []
  return untracked(
    () =>
      new Engine({
        ...props,
        effects: [...effects, ...DEFAULT_EFFECTS],
        drivers: [...drivers, ...DEFAULT_DRIVERS],
        shortcuts: [...shortcuts, ...DEFAULT_SHORTCUTS],
      })
  )
}
