import { extractorSplit, extractorSvelte } from '@unocss/core'
import { expect, it } from 'vitest'

it('extractorSplit', async () => {
  async function extract(code: string) {
    return [...await extractorSplit.extract({ code, original: code }) || []]
  }

  expect(await extract('foo')).eql(['foo'])
  expect(await extract('<div class="text-red border">foo</div>')).toContain('text-red')
  expect(await extract('<div class="<sm:text-lg">foo</div>')).toContain('<sm:text-lg')
  expect(await extract('"class=\"bg-white\""')).toContain('bg-white')
})

it('extractorSvelte uses regular split with non .svelte files', async () => {
  async function extract(code: string) {
    return [...await extractorSvelte.extract({ code, original: code }) || []]
  }

  expect(await extract('foo')).eql(['foo'])
  expect(await extract('<div class="text-red border">foo</div>')).toContain('text-red')
  expect(await extract('<div class="<sm:text-lg">foo</div>')).toContain('<sm:text-lg')
  expect(await extract('"class=\"bg-white\""')).toContain('bg-white')

  expect(await extract('<div class:text-orange-400={foo} />')).toContain('class:text-orange-400=')
  expect(await extract('class:text-gray-800={$page.url.pathname.startsWith(\'/test\')}')).toContain('class:text-gray-800=')
  expect(await extract('<div class="data-[a~=b]:text-red">foo</div>')).toContain('data-[a~=b]:text-red')
  expect(await extract('<div class:text-[32px]="{true}" />')).toContain('class:text-[32px]=')
})

it('extractorSvelte uses svelte-specific split with .svelte files', async () => {
  async function extract(code: string) {
    return [...await extractorSvelte.extract({ code, original: code, id: 'file.svelte' }) || []]
  }

  expect(await extract('foo')).eql(['foo'])
  expect(await extract('<div class="text-red border">foo</div>')).toContain('text-red')
  expect(await extract('<div class="<sm:text-lg">foo</div>')).toContain('<sm:text-lg')
  expect(await extract('"class=\"bg-white\""')).toContain('bg-white')

  expect(await extract('<div class:text-orange-400={foo} />')).toContain('text-orange-400')
  expect(await extract('class:text-gray-800={$page.url.pathname.startsWith(\'/test\')}')).toContain('text-gray-800')
  expect(await extract('<div class="data-[a~=b]:text-red">foo</div>')).toContain('data-[a~=b]:text-red')
  expect(await extract('<div class:text-[32px]="{true}" />')).toContain('text-[32px]')
})
