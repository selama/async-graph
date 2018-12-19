export interface _AsyncNode {
  do(whenResult?: any): Promise<any>;
  when?: Promise<any> | _AsyncGraph;
}

export interface _AsyncGraph {
  [key: string]: _AsyncNode;
}

const isPromise = (when: Promise<any> | _AsyncGraph): when is Promise<any> =>
  !!(when as Promise<any>).then;

export class _AsyncGraphResolver {
  static resolve = async (asyncTree: _AsyncGraph) => {
    const keys: string[] = Object.keys(asyncTree);
    const nodes: _AsyncNode[] = keys.map(key => asyncTree[key]);
    const results = await Promise.all(
      nodes.map((node: _AsyncNode) =>
        _AsyncGraphResolver.resolveSingleNode(node),
      ),
    );

    return keys.reduce((accumulator, key, i) => {
      return { ...accumulator, ...{ [key]: results[i] } };
    }, {});
  };

  private static readonly resolveSingleNode = (asyncNode: _AsyncNode) => {
    if (asyncNode.when) {
      if (isPromise(asyncNode.when)) {
        // asyncNode.when is a Promise
        return (asyncNode.when as Promise<any>).then(result =>
          asyncNode.do(result),
        );
      }
      // asyncNode.when is an _AsyncGraph
      return _AsyncGraphResolver
        .resolve(asyncNode.when as _AsyncGraph)
        .then(result => asyncNode.do(result));
    }
    // asyncNode.when is omited
    return asyncNode.do();
  };
}
