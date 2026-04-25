import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

type DocsGroup = {
  pages?: string[]
}

type DocsTab = {
  groups?: DocsGroup[]
}

type DocsConfig = {
  navigation?: {
    tabs?: DocsTab[]
  }
}

const docsRoot = path.dirname(fileURLToPath(import.meta.url))
const docsConfigPath = path.join(docsRoot, 'docs.json')
const docsConfig = JSON.parse(
  fs.readFileSync(docsConfigPath, 'utf8')
) as DocsConfig

const navigationPages =
  docsConfig.navigation?.tabs?.flatMap(
    (tab) => tab.groups?.flatMap((group) => group.pages ?? []) ?? []
  ) ?? []

const requiredRoutes = [
  'introduction',
  'why-leapfrog',
  'quickstart',
  'features/tray',
  'features/workspace',
  'features/indexing',
  'features/transcripts',
  'features/tags',
  'features/auto-tagging',
  'features/favorites',
  'features/chat',
  'features/chat-tools',
  'features/skills-and-commands',
  'features/authentication',
  'features/redaction',
  'features/privacy-and-diagnostics',
  'basics/workspaces',
  'basics/transcribing-interviews',
  'basics/quotes-and-tags',
  'basics/auto-coding',
  'basics/chat',
  'basics/agent-skills',
]

const getMissingRoutes = (routes: string[]) =>
  routes.filter((route) => !fs.existsSync(path.join(docsRoot, `${route}.mdx`)))

describe('docs navigation', () => {
  it('maps every docs.json page to an mdx file', () => {
    expect(navigationPages.length).toBeGreaterThan(0)
    expect(getMissingRoutes(navigationPages)).toEqual([])
  })

  it('keeps required desktop and legacy routes available', () => {
    expect(getMissingRoutes(requiredRoutes)).toEqual([])
  })
})
