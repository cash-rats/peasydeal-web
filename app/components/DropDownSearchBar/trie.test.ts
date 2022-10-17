import { assert, expect, test } from 'vitest';

import TrieNode from './trie';

describe('preffix trie node', () => {
  test('populate trie from string ', () => {
    const root = new TrieNode(null);
    root.populatePrefixTrie('shoe');
    root.populatePrefixTrie('shit');
    // console.log('root', root.children['s'].children['h'].children['o'].children['e']);
    // console.log('root', root.children['s'].children['h']);
  })

  test('find all prefix matches from a trie', () => {
    const root = new TrieNode(null);

    root.populatePrefixTrie('shoe');
    root.populatePrefixTrie('shit');
    root.populatePrefixTrie('test');
    root.populatePrefixTrie('teac');
    root.populatePrefixTrie('teaccc');

    // should output test, teac
    const matches = root.findAllMatched('te');
    expect(matches).toEqual(
      expect.arrayContaining(['test', 'teac', 'teaccc'])
    );
  })
})