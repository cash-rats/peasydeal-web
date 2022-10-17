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

import nodeTest from "node:test";

class TrieNode {
  constructor(key) {
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

    // we keep a reference to parent.
    this.parent = null;

    // end symbol to be '*'. when we see '*' in prefixMap, we know that this node is the end of a word.
    this.end = false;
  }

  // Given a string, populate a trie.
  // O(n) where n is the length of a word.
  populatePrefixTrie(word) {
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

    while (node !== null) {
      output.unshift(node.key);
      node = node.parent;
    }

    return output.join('');
  }

  // find all strings that matches the given prefix.
  findAllMatched(prefix) {
    let node = this;

    // find a trie node with it's key that doesn't match current char in prefix.
    // the decendents of the this trie node will be all matched strings.
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (node.children[char]) {
        node = node.children[char];
        continue;
      } else {
        break;
      }
    }

    const matches = [];
    findAllMatches(node, matches)

    return matches;
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

const singleton = newTrieNode();

export { singleton };

export default TrieNode;