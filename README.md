# Spock

Binding Clojure and Prolog... logically.

## Usage

There are two flavors in Spock: TuProlog and SWI. TuProlog is included with Java, so it's easier to get started. It's also _really slow_, so if you intend to use it in production for heavy calculations it's better to just use `core.logic` instead.

To use TuProlog, you need to create a "solver" with a group of Rules (prolog rules) and then call `solve` on that group of rules.

For SWI, you'll need to use `assert-rules` or `with-facts` - this will `assert` the facts globally by SWI, and `retract` then when you call `.close` on the return of `assert-rules` or `with-facts`. Normally, you'll use `with-facts` on tests. The reason is that `with-facts` will rename your facts/rules so they don't conflict with the global environment.

### Rules:

Both TuProlog and SWI use the same format - a "layer" that converts from Clojure to Prolog and vice-versa, and a group of "rules". The "rules" are just an array containing lists with two or three elements. It it's two elements, then it's a "fact". if three, it's a "rule" the third element MUST be a list of rules. There's also a number of other conversions:

1. Clojure `symbol`s become Prolog `atom`s
1. Clojure `keyword`s become Prolog `variable`s
1. Clojure `vector`s become Prolog `list`s
1. Any other object will be converted (hopefully!) to their prolog counterparts

So, for example, the following Clojure code:

```clojure
(def family-rules
  '[(parent [father son])
    (parent [son grandson])

    (ancestor [:x :y] [(parent :x :y)])
    (ancestor [:x :y] [(parent :x :z)
                       (ancestor :z :y)])])
```

Is equivalent to the following Prolog:

```prolog
parent(father, son).
parent(son, grandson).

ancestor(X, Y) :- parent(X, Y).
ancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).
```

### SWI Prolog

To use SWI, you have to install [SWI-Prolog](https://www.swi-prolog.org/Download.html) on your machine, and also install the [JPL library](https://jpl7.org/). You _also_ need to prepare your environment in a way that it sees the library (`libjpl.so` on Linux, for example) and add `jpl.jar` on your classpath. On `lein`, it means adding the following lines:

```clojure
  :resource-paths ["resources/jpl.jar"]
  :jvm-opts [~(str "-Djava.library.path=resources/:" (System/getProperty "java.library.path"))]
```

And then copy or link both `jpl.jar` and `libjpl.so` (the one that's installed by the package - mine was on `/usr/share/java/jpl.jar` and `/usr/lib/x86_64-linux-gnu/jni/libjpl.so`) to `resources` directory. Please notice that you the library's name __will differ__ if you're on Windows or MacOSX, so please find the right name for your platform.

And then, you either assert all facts globally, or "rename" then so they don't conflict with anything that's already asserted, __then__ assert globally. Both will return an object that can be used to retract everything.

If you're using SWI in production, you probably just want to assert everything globally and that's it. If you are doing tests, you probably want to use `with-facts`. If you use `with-facts`, you need to pass the object to the query - otherwise, SWI will not know how to rename the facts/rules. Som considering that you already have the "family-rules` defined, the code is simply:

```clojure
(require '[spock.swi :as spock])

; Either assert things and then retract everything - usefull for tests:
(with-open [rules (spock/with-facts family-rules)]
  (spock/solve {:rules rules} '(ancestor father :child)))

; Or add everything globally
(spock/assert-rules family-rules)
(spock/solve '(ancestor father :child))

; You can also quote your whole query and then just send fragments of what you want:
(spock/solve {:binds {:child 'son}}'(ancestor :who :child))
```

### TuProlog

On TuProlog, you'll have to add the TuProlog's dependencies:

```clojure
[it.unibo.tuprolog/solve-jvm "0.17.4-dev09+485a46b2"]
[it.unibo.tuprolog/solve-classic-jvm "0.17.4-dev09+485a46b2"]]
```

And then, create a `solver`. With a solver, you can issue queries. So, considering that you already have the "family-rules` defined, the code is simply:

```clojure
(let [prolog (spock/solver family-rules)]
  (spock/solve {:rules prolog} '(ancestor father :child))
; Returns [{:child son} {:child grandson}]
```

## License

Copyright © 2021 Maurício Szabo

This program is licensed under the [2-Clause BSD](https://opensource.org/licenses/BSD-2-Clause), the same as SWI-Prolog.

TuProlog is licenced under the [Apache License, v2.0](https://opensource.org/licenses/Apache-2.0).
