import * as camel3 from '@hawtio/camel-model-v3'
import * as camel4 from '@hawtio/camel-model-v4'
import { MBeanNode } from '@hawtiosrc/plugins/shared/tree'
import * as camelService from './camel-service'
import { contextNodeType, endpointNodeType, endpointsType, jmxDomain } from './globals'

jest.mock('@hawtiosrc/plugins/shared/jolokia-service')

describe('camel-service', () => {
  test('setChildProperties', async () => {
    const domainNode = new MBeanNode(null, jmxDomain, true)
    const endpointsNode = domainNode.create(endpointsType, true)

    const childNames = [
      'mock://result',
      'quartz://cron?cron=0%2F10+*+*+*+*+%3F',
      'quartz://simple?trigger.repeatInterval=10000',
      'stream://out',
    ]
    for (const childName of childNames) {
      endpointsNode.create(childName, false)
    }

    expect(domainNode.childCount()).toBe(1)
    expect(domainNode.getChildren()).toContain(endpointsNode)
    expect(endpointsNode.childCount()).toBe(4)

    endpointsNode.setType(endpointsType)
    camelService.setDomain(endpointsNode)
    camelService.setChildProperties(endpointsNode, endpointNodeType)

    expect(endpointsNode.getType()).toBe(endpointsType)
    expect(endpointsNode.getMetadata('domain')).toBe(jmxDomain)
    for (const child of endpointsNode.getChildren()) {
      expect(child.getType()).toBe(endpointNodeType)
      expect(child.getMetadata('domain')).toBe(jmxDomain)
    }
  })

  test('getCamelModel', () => {
    const camel3Node = new MBeanNode(null, 'test-context-camel3', true)
    camel3Node.addMetadata('domain', jmxDomain)
    camel3Node.setType(contextNodeType)
    camel3Node.addMetadata('version', '3.21.0')
    const camel3Model = camelService.getCamelModel(camel3Node)
    expect(camel3Model).toBeDefined()
    expect(camel3Model.apacheCamelModelVersion).toBe(camel3.apacheCamelModelVersion)
    expect(camel3Model.components).not.toBeUndefined()
    expect(camel3Model.dataformats).not.toBeUndefined()
    expect(camel3Model.definitions).not.toBeUndefined()
    expect(camel3Model.languages).not.toBeUndefined()
    expect(camel3Model.rests).not.toBeUndefined()

    const camel4Node = new MBeanNode(null, 'test-context-camel4', true)
    camel4Node.addMetadata('domain', jmxDomain)
    camel4Node.setType(contextNodeType)
    camel4Node.addMetadata('version', '4.0.0')
    const camel4Model = camelService.getCamelModel(camel4Node)
    expect(camel4Model).toBeDefined()
    expect(camel4Model.apacheCamelModelVersion).toBe(camel4.apacheCamelModelVersion)
    expect(camel4Model.components).not.toBeUndefined()
    expect(camel4Model.dataformats).not.toBeUndefined()
    expect(camel4Model.definitions).not.toBeUndefined()
    expect(camel4Model.languages).not.toBeUndefined()
    expect(camel4Model.rests).not.toBeUndefined()
  })

  test('compareVersions', () => {
    const versions = [
      { v: '2.2.0', ma: 1, mi: 0, r: 1 },
      { v: '2.2.0', ma: 2, mi: 0, r: 1 },
      { v: '2.2.0', ma: 3, mi: 0, r: -1 },
      { v: '2.2.0', ma: 2, mi: 1, r: 1 },
      { v: '2.2.0', ma: 2, mi: 2, r: 0 },
      { v: '2.2.0', ma: 2, mi: 3, r: -1 },
      { v: '2.3.4', ma: 2, mi: 3, r: 0 },
      { v: '1.2.3.4', ma: 1, mi: 2, r: 0 },
      { v: '1.2.3.4', ma: 2, mi: 2, r: -1 },
      { v: '1.2.3.4', ma: 4, mi: 2, r: -1 },
      { v: 'v1.2.3.4', ma: 0, mi: 0, r: 1 },
      { v: 'v1.2.3.4', ma: 1, mi: 0, r: -1 },
      { v: 'v1.2.3.4', ma: 2, mi: 0, r: -1 },
      { v: '2.2.3.0-alpha', ma: 1, mi: 3, r: 1 },
      { v: '2.2.3.0-alpha', ma: 2, mi: 3, r: -1 },
      { v: '2.2.3.0-alpha', ma: 2, mi: 2, r: 0 },
    ]

    for (const data of versions) {
      expect({
        v: data.v,
        ma: data.ma,
        mi: data.mi,
        r: camelService.compareVersions(data.v, data.ma, data.mi),
      }).toEqual(data)
    }
  })

  test('isCamelVersionEQGT', () => {
    const ctxNode = new MBeanNode(null, 'sample app', true)
    camelService.setDomain(ctxNode)
    ctxNode.setType(contextNodeType)

    const versions = [
      { v: '3.21.0', r: false },
      { v: '3.22.0-Beta1', r: false },
      { v: '4.0.0-RC1', r: true },
      { v: '4.0.0', r: true },
      { v: '4.1.0', r: true },
      { v: '5.0.0', r: true },
    ]
    for (const version of versions) {
      ctxNode.addMetadata('version', version.v)
      expect(camelService.isCamelVersionEQGT(ctxNode, 4, 0)).toBe(version.r)
    }
  })
})
