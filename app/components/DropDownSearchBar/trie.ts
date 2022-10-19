/*
For example: shoe, shit

  Trie {
    key: null ---> root node

    children: {
      's': Trie {
        key: 's'
        children: {
          h: Trie {
            key: 'h'
            children: {
              o: Trie {
                key: 'o',
                children: {
                  e: Trie {
                    key: 'e'
                    children: {
                      '*': null
                    }
                  }

                }
              }

              i: Trie {

              }
            }
          }
        }
      },
      'b': Trie,
    }
  }

    Trie
     /
    s
   /
  h
 /
o

*/

// data that we wish to go with this node.
type DataCache = {
  [index: string]: any;
}

export const dataCache: DataCache = {};

type MatchesWithData = {
  title: string;
  data: any;
}

// this.data = data;
class TrieNode {
  constructor(key: string | null) {
    this.key = key;

    /* key : Trie pair that remembers all children characters of a given node.

      For example:
      {
        's': TrieNode {
          key: 's',
          children: {
            h: TrieNode {
              key: 'h' ---> character 'h' is a childnode of 's'
              ...
            }
          }
        }
      }
    */
    this.children = {};

    // end symbol to be '*'. when we see '*' in prefixMap, we know that this node is the end of a word.
    this.end = false;
  }

  // Given a string, populate a trie. O(n) where n is the length of a word.
  populatePrefixTrie<T>(word: string, data?: T) {
    if (!word) return;
    // cache data with key first.
    dataCache[word] = data || {};
    let node = this;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];

      // If character does not exists in children, create a mapping
      if (!node.children[char]) {

        node.children[char] = new TrieNode(char);
        node.children[char].parent = node;
      }

      node = node.children[char];
    }

    // We reach the end of the word. 'node' should represents the last word, we append end symbol in the child node.
    node.end = true;
  }

  getWord() {
    let output = [];
    let node = this;

    while (node.parent) {
      if (node.key) { // root node does not have key.
        output.unshift(node.key);
      }
      node = node.parent;
    }

    return output.join('');
  }

  // find all strings that matches the given prefix.
  findAllMatched(prefix: string) {
    let node = this;

    // find a trie node with it's key that doesn't match current char in prefix.
    // the decendents of the this trie node will be all matched strings.
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      node = node.children[char];
      if (!node) return [];
    }

    const matches = [];

    findAllMatches(node, matches);

    return matches;
  }

  // find all matches keys along with it's relative data.
  findAllMatchedWithData(prefix: string): MatchesWithData[] {
    const matches = this.findAllMatched(prefix);
    const matchesWithData: MatchesWithData[] = [];
    for (let i = 0; i < matches.length; i++) {
      const matchesKey = matches[i];
      if (dataCache[matchesKey]) {
        matchesWithData.push({ title: matchesKey, data: dataCache[matchesKey] });
      }
    }

    return matchesWithData;
  }
}

function findAllMatches(trieNode, matches) {
  if (trieNode.end) {
    matches.unshift(trieNode.getWord());
  }

  for (let child in trieNode.children) {
    findAllMatches(trieNode.children[child], matches);
  }
}


function newTrieNode() {
  return new TrieNode(null);
}

const rootNode = newTrieNode();

export { rootNode };

export default TrieNode;